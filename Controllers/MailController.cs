using Microsoft.AspNetCore.Mvc;
using TTDVDTTNCXH.DTOs;
using System.Text;
using System.Security.Cryptography;

namespace TTDVDTTNCXH.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MailController : ControllerBase
    {
        private readonly ILogger<MailController> _logger;
        private readonly string _mailerApiUrl = "https://info.vttu.edu.vn/api/guest/mailer_service/add_queue.php";
        private readonly HttpClient _httpClient;

        public MailController(ILogger<MailController> logger, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.Timeout = TimeSpan.FromSeconds(30);
        }

        /// <summary>
        /// Proxy endpoint để gửi mail vào queue (tránh CORS)
        /// Giống với Laravel: gửi POST với http_build_query đến PHP API
        /// </summary>
        [HttpPost("send-queue")]
        public async Task<ActionResult<MailQueueResponse>> SendMailQueue([FromBody] MailQueueRequest request)
        {
            try
            {
                _logger.LogInformation("SendMailQueue request received for receivers: {Receivers}", request.Receivers);

                // Validate request
                if (string.IsNullOrEmpty(request.Receivers))
                {
                    return BadRequest(new MailQueueResponse
                    {
                        Success = false,
                        Message = "Receivers is required"
                    });
                }

                // Tạo form data (tương đương http_build_query trong PHP)
                var formData = new Dictionary<string, string>
                {
                    { "time", request.Time },
                    { "token", request.Token },
                    { "name", request.Name },
                    { "subject", request.Subject },
                    { "body", request.Body },
                    { "code", request.Code },
                    { "receivers", request.Receivers }
                };

                // Thêm CC nếu có
                if (!string.IsNullOrEmpty(request.Cc))
                {
                    formData["cc"] = request.Cc;
                }

                // Tạo HttpContent từ form data
                var content = new FormUrlEncodedContent(formData);

                // Gửi request đến PHP API (server-to-server, không có CORS)
                var response = await _httpClient.PostAsync(_mailerApiUrl, content);
                var responseBody = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Mail API response: StatusCode={StatusCode}, Body={ResponseBody}", 
                    response.StatusCode, responseBody);

                var result = new MailQueueResponse
                {
                    Success = response.IsSuccessStatusCode,
                    HttpCode = (int)response.StatusCode,
                    Response = responseBody,
                    Message = response.IsSuccessStatusCode 
                        ? "Email đã được thêm vào queue thành công" 
                        : $"HTTP Error: {response.StatusCode}"
                };

                if (response.IsSuccessStatusCode)
                {
                    return Ok(result);
                }
                else
                {
                    return StatusCode((int)response.StatusCode, result);
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error sending mail queue");
                return StatusCode(500, new MailQueueResponse
                {
                    Success = false,
                    Message = $"HTTP Error: {ex.Message}",
                    Error = ex.Message
                });
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError(ex, "Timeout sending mail queue");
                return StatusCode(500, new MailQueueResponse
                {
                    Success = false,
                    Message = "Request timeout",
                    Error = "Request timeout after 30 seconds"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending mail queue: {ErrorMessage}", ex.Message);
                return StatusCode(500, new MailQueueResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Error = ex.Message
                });
            }
        }

        /// <summary>
        /// Test connection to mail queue API (tương tự testQueueConnection trong Laravel)
        /// </summary>
        [HttpGet("test-connection")]
        public async Task<ActionResult<MailQueueResponse>> TestConnection()
        {
            try
            {
                _logger.LogInformation("Test mail queue connection");

                // Generate test data (giống Laravel)
                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                var yearMonth = DateTime.Now.ToString("yyyyMM");
                var tokenInput = $"{yearMonth}#!!$@{timestamp}";
                var token = ComputeMD5Hash(tokenInput);

                var testData = new Dictionary<string, string>
                {
                    { "time", $"{timestamp}_test" },
                    { "token", token },
                    { "name", "Test Connection" },
                    { "subject", "Test Email" },
                    { "body", "<p>This is a test email</p>" },
                    { "cc", "" },
                    { "code", "xmhp" },
                    { "receivers", "test@example.com" }
                };

                var content = new FormUrlEncodedContent(testData);
                var response = await _httpClient.PostAsync(_mailerApiUrl, content);
                var responseBody = await response.Content.ReadAsStringAsync();

                var result = new MailQueueResponse
                {
                    Success = response.IsSuccessStatusCode,
                    HttpCode = (int)response.StatusCode,
                    Response = responseBody,
                    Message = response.IsSuccessStatusCode 
                        ? "Connection test successful" 
                        : $"Connection test failed: {response.StatusCode}"
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing mail queue connection: {ErrorMessage}", ex.Message);
                return StatusCode(500, new MailQueueResponse
                {
                    Success = false,
                    Message = $"Test failed: {ex.Message}",
                    Error = ex.Message
                });
            }
        }

        /// <summary>
        /// Compute MD5 hash (tương đương md5() trong PHP)
        /// </summary>
        private string ComputeMD5Hash(string input)
        {
            using (var md5 = MD5.Create())
            {
                var hashBytes = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
    }
}

