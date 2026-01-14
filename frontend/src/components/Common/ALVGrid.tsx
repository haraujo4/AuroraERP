import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export interface Column<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'right' | 'center';
}

interface ALVGridProps<T> {
    data: T[];
    columns: Column<T>[];
    searchTerm?: string;
    loading?: boolean;
    onRowClick?: (item: T) => void;
    actions?: React.ReactNode;
    hideExport?: boolean;
}

export function ALVGrid<T extends { id: string | number }>({
    data,
    columns,
    searchTerm = '',
    loading,
    onRowClick,
    actions,
    hideExport = false
}: ALVGridProps<T>) {
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: keyof T) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleExportExcel = () => {
        // Filter out action columns
        const exportColumns = columns.filter(c => c.key !== 'actions');

        // Map data to export format
        const exportData = filteredAndSortedData.map(item => {
            const row: any = {};
            exportColumns.forEach(col => {
                // If there's a custom renderer, we ideally want the raw value or a text representation
                // But for simplicity, we use the raw value. If it's an object, we might get [object Object]
                // Improved logic: check if value is object, if so, try to find a name property or similar?
                // For now, raw value is safest for most DTOs which are flat.
                const val = item[col.key as keyof T];
                row[col.label] = val;
            });
            return row;
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dados");
        XLSX.writeFile(wb, "exportacao_sistema.xlsx");
    };

    const filteredAndSortedData = useMemo(() => {
        let result = [...data];

        // Search
        if (searchTerm) {
            result = result.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchTerm, sortConfig]);

    return (
        <div className="flex flex-col h-full bg-bg-primary overflow-hidden border border-border-default shadow-sm rounded-lg">
            {/* Toolbar for Actions and Export */}
            <div className="flex items-center justify-end px-3 py-1.5 bg-bg-secondary border-b border-border-default gap-2 text-xs">
                {!hideExport && (
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-1 text-text-secondary hover:text-brand-primary transition-colors"
                        title="Exportar para Excel"
                    >
                        <Download size={14} />
                        <span className="font-medium">EXPORTAR</span>
                    </button>
                )}
                {/* Separator if actions exist */}
                {!hideExport && actions && <div className="h-4 w-px bg-border-default mx-1"></div>}
                {actions}
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-auto bg-white min-h-0 relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                        <div className="flex flex-col items-center gap-3 p-6 rounded-xl">
                            <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                            <p className="text-xs font-medium text-text-secondary tracking-wide">RECUPERANDO DADOS...</p>
                        </div>
                    </div>
                ) : (
                    <table className="w-full text-xs border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-bg-secondary select-none">
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        className={`
                      px-3 py-1.5 border-b border-r border-border-default text-text-secondary font-semibold text-left 
                      hover:bg-bg-secondary-hover transition-colors cursor-pointer group whitespace-nowrap
                      ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                    `}
                                        style={{ width: col.width }}
                                        onClick={() => col.sortable !== false && col.key !== 'actions' && handleSort(col.key as keyof T)}
                                    >
                                        <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                                            {col.label}
                                            {col.sortable !== false && col.key !== 'actions' && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {sortConfig?.key === col.key ? (
                                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-brand-primary" /> : <ChevronDown className="w-3 h-3 text-brand-primary" />
                                                    ) : (
                                                        <ChevronUp className="w-3 h-3 text-border-strong" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedData.map((item, idx) => (
                                <tr
                                    key={item.id}
                                    onClick={() => onRowClick?.(item)}
                                    className={`
                    hover:bg-brand-primary/5 cursor-pointer group transition-colors
                    ${idx % 2 === 0 ? 'bg-white' : 'bg-bg-secondary/20'}
                  `}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={String(col.key)}
                                            className={`
                        px-3 py-1 border-b border-r border-border-default text-text-primary whitespace-nowrap overflow-hidden text-ellipsis
                        ${col.align === 'right' ? 'text-right font-mono' : col.align === 'center' ? 'text-center' : 'text-left'}
                      `}
                                        >
                                            {col.render ? col.render(item[col.key as keyof T], item) : String(item[col.key as keyof T] ?? '')}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {filteredAndSortedData.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-3 py-10 text-center text-text-secondary italic bg-bg-primary/10">
                                        Nenhum registro encontrado para os critérios selecionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Status Bar */}
            <div className="px-3 py-1 bg-bg-secondary border-t border-border-default flex justify-end items-center text-[10px] text-text-secondary font-medium uppercase tracking-wider">
                <div>
                    EXIBINDO {filteredAndSortedData.length} DE {data.length} REGISTROS
                </div>
            </div>
        </div>
    );
}
