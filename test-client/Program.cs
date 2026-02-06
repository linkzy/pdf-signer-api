using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;

class Program
{
    static async Task Main(string[] args)
    {
        string apiUrl = "https://homologacaoacessoconveniadas.objetivo.br/pdf-do-djsao/sign/"; // Your API URL
        string apiToken = "e6921daae42b4dc3a8f4cee02d2aa617"; // Your API secret token
        string pdfPath = "generated_without_libraries.pdf"; // Path to the PDF file
        string certPath = "tst_new_certificate.p12"; // Path to the certificate (.p12)

        try
        {
            for (int i = 1; i < 10000; i++)
            {
                var client = new HttpClient();

                // Set the Authorization header with the token
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);

                var form = new MultipartFormDataContent();

                // Add the PDF file
                var pdfContent = new ByteArrayContent(File.ReadAllBytes(pdfPath));
                pdfContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/pdf");
                form.Add(pdfContent, "pdf", "file.pdf");

                // Add the certificate (.p12) file
                var certContent = new ByteArrayContent(File.ReadAllBytes(certPath));
                certContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/x-pkcs12");
                form.Add(certContent, "certificate", "certificate.p12");

                // Additional fields
                form.Add(new StringContent("Test Reason"), "reason");
                form.Add(new StringContent("test@example.com"), "contactInfo");
                form.Add(new StringContent("John Doe"), "name");
                form.Add(new StringContent("Default Location"), "location");
                form.Add(new StringContent("50"), "widgetRectX1");
                form.Add(new StringContent("200"), "widgetRectY1");
                form.Add(new StringContent("150"), "widgetRectX2");
                form.Add(new StringContent("250"), "widgetRectY2");

                var response = await client.PostAsync(apiUrl, form);

                if (response.IsSuccessStatusCode)
                {
                    var signedPdfBytes = await response.Content.ReadAsByteArrayAsync();

                    // Save the signed PDF
                    File.WriteAllBytes("signed_output.pdf", signedPdfBytes);
                    Console.WriteLine("Signed PDF saved successfully!");
                }
                else
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {response.ReasonPhrase}");
                }
                Console.WriteLine($"{i} : {System.DateTime.Now}");
            }
            
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
        }
    }
}
