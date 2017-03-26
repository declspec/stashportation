using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Stashportation.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace Stashportation.Filters {
    public class ApiExceptionFilter : ExceptionFilterAttribute
    {
        private readonly ILogger _logger;
        
        public ApiExceptionFilter(ILoggerFactory loggerFactory) {
            _logger = loggerFactory.CreateLogger<ApiExceptionFilter>();
        }

        public override void OnException(ExceptionContext context) {
            context.Result = ProcessException(context.HttpContext, context.Exception);
            base.OnException(context);
        }

        private IActionResult ProcessException(HttpContext context, Exception exception) {
            // Unwrap AggregateExceptions
            if (exception is AggregateException) {
                var agg = (AggregateException)exception;
                for (var i = 1; i < agg.InnerExceptions.Count; ++i)
                    LogException(agg.InnerExceptions[i]);

                return ProcessException(context, exception.InnerException);
            }

            if (exception is ValidationException)
                return context.Response.ValidationError(exception.Message);

            return context.Response.ServerError("An unexpected error occurred");
        }

        private void LogException(Exception ex) {
            _logger.LogError(0, ex, "error");
        }
    }
}
