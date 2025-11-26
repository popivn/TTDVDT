using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;

namespace TTDVDTTNCXH.Attributes
{
    public class RequireApiKeyAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var configuration = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<RequireApiKeyAttribute>>();
            
            var expectedApiKey = configuration["GlobalSettings:APIKey"];
            
            if (string.IsNullOrEmpty(expectedApiKey))
            {
                logger.LogError("APIKey is not configured in appsettings.json");
                context.Result = new StatusCodeResult(500);
                return;
            }

            var providedApiKey = context.HttpContext.Request.Query["APIKEY"].ToString();
            
            if (string.IsNullOrEmpty(providedApiKey))
            {
                logger.LogWarning("APIKEY parameter is missing from request");
                context.Result = new BadRequestObjectResult(new
                {
                    success = false,
                    message = "APIKEY parameter is required"
                });
                return;
            }

            if (providedApiKey != expectedApiKey)
            {
                logger.LogWarning("Invalid APIKEY provided: {ProvidedApiKey}", providedApiKey);
                context.Result = new UnauthorizedObjectResult(new
                {
                    success = false,
                    message = "Invalid APIKEY"
                });
                return;
            }

            base.OnActionExecuting(context);
        }
    }
}

