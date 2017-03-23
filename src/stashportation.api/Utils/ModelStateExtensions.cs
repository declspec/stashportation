using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Stashportation.Utils {
    public static class ModelStateExtensions {
        public static IList<string> GetAllErrors(this ModelStateDictionary modelState) {
            var errors = new List<string>();

            foreach (var value in modelState.Values)
                foreach (var error in value.Errors)
                    errors.Add(error.ErrorMessage);

            return errors;
        }
    }
}
