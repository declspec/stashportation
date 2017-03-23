using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Stashportation.Utils {
    public static class HttpResponseExtensions {
        private const string DefaultError = "An unexpected error occurred during the request";
        private const string BadRequestMessage = "Bad resuest";
        private const string ValidationErrorMessage = "Failed to validate the entity";
        private const string ServerErrorMessage = "Internal server error";
        private const string ForbiddenMessage = "Forbidden";
        private const string UnauthorizedMessage = "Unauthorized";
        private const string NotFoundMessage = "Not found";

        public static IActionResult Success(this HttpResponse res, HttpStatusCode code, object data) {
            var statusCode = (int)code;
            return new ObjectResult(new ApiResponse(statusCode, data)) {
                StatusCode = statusCode
            };
        }

        public static IActionResult Created(this HttpResponse res, object result) {
            return Success(res, HttpStatusCode.Created, result);
        }

        public static IActionResult Ok(this HttpResponse res, object data) {
            return Success(res, HttpStatusCode.OK, data);
        }

        public static IActionResult Error(this HttpResponse res, HttpStatusCode code, IList<Exception> errors) {
            return Error(res, code, DefaultError, errors);
        }

        public static IActionResult Error(this HttpResponse res, HttpStatusCode code, params string[] errors) {
            return Error(res, code, DefaultError, errors);
        }

        public static IActionResult BadRequest(this HttpResponse res, IList<Exception> errors) {
            return Error(res, HttpStatusCode.BadRequest, BadRequestMessage, errors);
        }

        public static IActionResult BadRequest(this HttpResponse res, IList<string> errors) {
            return Error(res, HttpStatusCode.BadRequest, BadRequestMessage, errors);
        }

        public static IActionResult BadRequest(this HttpResponse res, params string[] errors) {
            return Error(res, HttpStatusCode.BadRequest, BadRequestMessage, errors);
        }

        public static IActionResult Forbidden(this HttpResponse res, IList<Exception> errors) {
            return Error(res, HttpStatusCode.Forbidden, ForbiddenMessage, errors);
        }

        public static IActionResult Forbidden(this HttpResponse res, IList<string> errors) {
            return Error(res, HttpStatusCode.Forbidden, ForbiddenMessage, errors);
        }

        public static IActionResult Forbidden(this HttpResponse res, params string[] errors) {
            return Error(res, HttpStatusCode.Forbidden, ForbiddenMessage, errors);
        }

        public static IActionResult NotFound(this HttpResponse res, IList<Exception> errors) {
            return Error(res, HttpStatusCode.NotFound, NotFoundMessage, errors);
        }

        public static IActionResult NotFound(this HttpResponse res, IList<string> errors) {
            return Error(res, HttpStatusCode.NotFound, NotFoundMessage, errors);
        }

        public static IActionResult NotFound(this HttpResponse res, params string[] errors) {
            return Error(res, HttpStatusCode.NotFound, NotFoundMessage, errors);
        }

        public static IActionResult ServerError(this HttpResponse res, IList<Exception> errors) {
            return Error(res, HttpStatusCode.InternalServerError, ServerErrorMessage, errors);
        }

        public static IActionResult ServerError(this HttpResponse res, IList<string> errors) {
            return Error(res, HttpStatusCode.InternalServerError, ServerErrorMessage, errors);
        }

        public static IActionResult ServerError(this HttpResponse res, params string[] errors) {
            return Error(res, HttpStatusCode.InternalServerError, ServerErrorMessage, errors);
        }

        public static IActionResult Unauthorized(this HttpResponse res, IList<Exception> errors) {
            return Error(res, HttpStatusCode.Unauthorized, UnauthorizedMessage, errors);
        }

        public static IActionResult Unauthorized(this HttpResponse res, IList<string> errors) {
            return Error(res, HttpStatusCode.Unauthorized, UnauthorizedMessage, errors);
        }

        public static IActionResult Unauthorized(this HttpResponse res, params string[] errors) {
            return Error(res, HttpStatusCode.Unauthorized, UnauthorizedMessage, errors);
        }

        public static IActionResult ValidationError(this HttpResponse res, IList<Exception> errors) {
            return Error(res, (HttpStatusCode)422, ValidationErrorMessage, errors);
        }

        public static IActionResult ValidationError(this HttpResponse res, IList<string> errors) {
            return Error(res, (HttpStatusCode)422, ValidationErrorMessage, errors);
        }

        public static IActionResult ValidationError(this HttpResponse res, params string[] errors) {
            return Error(res, (HttpStatusCode)422, ValidationErrorMessage, errors);
        }

        private static IActionResult Error(this HttpResponse res, HttpStatusCode code, string defaultMessage, IList<string> errors) {
            var statusCode = (int)code;
            return new ObjectResult(new ApiResponse(statusCode, TransformErrors(defaultMessage, errors))) {
                StatusCode = statusCode
            };
        }

        private static IActionResult Error(this HttpResponse res, HttpStatusCode code, string defaultMessage, IList<Exception> errors) {
            var statusCode = (int)code;
            return new ObjectResult(new ApiResponse(statusCode, TransformErrors(defaultMessage, errors))) {
                StatusCode = statusCode
            };
        }

        private static string[] TransformErrors(string defaultError, IList<Exception> errors) {
            var messages = errors.Select(e => e != null ? e.Message : null)
                .Where(m => !string.IsNullOrEmpty(m))
                .ToArray();

            return messages.Length == 0
                ? new[] { defaultError }
                : messages;
        }

        private static string[] TransformErrors(string defaultError, IList<string> errors) {
            var messages = errors.Where(m => !string.IsNullOrEmpty(m))
                .ToArray();

            return messages.Length == 0
                ? new[] { defaultError }
                : messages;
        }

        private struct ApiResponse {
            public string[] Errors { get; }
            public object Data { get; }
            public int Status { get; }

            public ApiResponse(int status, object data) {
                Errors = new string[] { };
                Data = data;
                Status = status;
            }

            public ApiResponse(int status, string[] errors) {
                Errors = errors;
                Data = null;
                Status = status;
            }
        }
    }
}
