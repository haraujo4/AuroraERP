# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files first to cache restore
COPY ["AuroraERP.sln", "./"]
COPY ["Aurora.API/Aurora.API.csproj", "Aurora.API/"]
COPY ["Aurora.Application/Aurora.Application.csproj", "Aurora.Application/"]
COPY ["Aurora.Domain/Aurora.Domain.csproj", "Aurora.Domain/"]
COPY ["Aurora.Infrastructure/Aurora.Infrastructure.csproj", "Aurora.Infrastructure/"]

RUN dotnet restore "AuroraERP.sln"

# Copy the rest of the source code
COPY . .

# Build and Publish
WORKDIR "/src/Aurora.API"
RUN dotnet publish "Aurora.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Run Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Aurora.API.dll"]
