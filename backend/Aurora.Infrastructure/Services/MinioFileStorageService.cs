using System;
using System.IO;
using System.Threading.Tasks;
using Aurora.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;

namespace Aurora.Infrastructure.Services
{
    public class MinioFileStorageService : IFileStorageService
    {
        private readonly IMinioClient _minioClient;
        private readonly string _bucketName;

        public MinioFileStorageService(IConfiguration configuration)
        {
            var endpoint = configuration["Minio:Endpoint"];
            var accessKey = configuration["Minio:AccessKey"];
            var secretKey = configuration["Minio:SecretKey"];
            _bucketName = configuration["Minio:BucketName"] ?? "invoices";

            _minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey)
                .Build();
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            // Ensure bucket exists
            var beArgs = new BucketExistsArgs().WithBucket(_bucketName);
            bool found = await _minioClient.BucketExistsAsync(beArgs).ConfigureAwait(false);
            if (!found)
            {
                var mbArgs = new MakeBucketArgs().WithBucket(_bucketName);
                await _minioClient.MakeBucketAsync(mbArgs).ConfigureAwait(false);
            }

            // Upload
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(fileName)
                .WithStreamData(fileStream)
                .WithObjectSize(fileStream.Length)
                .WithContentType(contentType);

            await _minioClient.PutObjectAsync(putObjectArgs).ConfigureAwait(false);

            return fileName; 
            // In a real app we might return a full URL if exposing via Gateway, 
            // generally: http://localhost:9000/invoices/filename
            // or return just the key and generate presigned URLs.
            // For this project, let's return the key and assume global public access or construct URL in controller.
        }

        public async Task<Stream> GetFileAsync(string fileName)
        {
            var memoryStream = new MemoryStream();
            var args = new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(fileName)
                .WithCallbackStream((stream) =>
                {
                    stream.CopyTo(memoryStream);
                });

            await _minioClient.GetObjectAsync(args).ConfigureAwait(false);
            memoryStream.Position = 0;
            return memoryStream;
        }
    }
}
