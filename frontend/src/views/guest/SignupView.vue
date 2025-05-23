<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import DefaultLayout from "@/layouts/user/DefaultLayout.vue";
import oauthServices from "@/services/oauthServices";
import { RouterLink } from "vue-router";
import Toast from "@/components/Toast.vue";
import { useToastStore } from "@/stores/toast";

const router = useRouter();
const showPassword = ref(false);
const formError = ref("");
const toastStore = useToastStore();

// Define validation schema using yup
const schema = yup.object({
  last_name: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters long"),
  first_name: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters long"),
  phone: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .matches(/^\d+$/, "Phone number must contain only digits"),
  address: yup
    .string()
    .required("Address is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
  acceptTerms: yup
    .boolean()
    .required("You must accept the terms and conditions")
    .oneOf([true], "You must accept the terms and conditions"),
});

// Password strength checker
const getPasswordStrength = (password) => {
  return {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    isLongEnough: password?.length >= 6,
  };
};

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Social signup handlers
const handleGoogleSignup = async () => {
  try {
    console.log("Signing up with Google");
  } catch (error) {
    formError.value = "Google signup failed. Please try again.";
  }
};

const handleFacebookSignup = async () => {
  try {
    console.log("Signing up with Facebook");
  } catch (error) {
    formError.value = "Facebook signup failed. Please try again.";
  }
};

// Form submission handler with length validation
const onSubmit = async (values) => {
  // Check password and confirm password length
  if (values.password.length > 20 || values.confirmPassword.length > 20) {
    formError.value = "Password and confirm password must not exceed 20 characters.";
    toastStore.showToast(5000, formError.value, "bg-red-300");
    return; // Prevent API call if length exceeds 20 characters
  }

  try {
    const signupData = {
      ...values,
      full_name: `${values.first_name} ${values.last_name}`,
    };
    delete signupData.confirmPassword; // Remove confirmPassword as it's not needed in the API call

    const response = await oauthServices.signup(signupData);
    if (response.status === 200) {
      toastStore.showToast(5000, "Sign up successfully", "bg-emerald-500");
      router.push("/"); // Redirect to home page on success
    } else {
      formError.value = "Something went wrong. Please try again.";
      toastStore.showToast(5000, formError.value, "bg-red-300");
    }
  } catch (error) {
    formError.value = error.response?.data?.message || "Registration failed. Please try again.";
    toastStore.showToast(5000, formError.value, "bg-red-300");
    console.error("Signup error:", error);
  }
};
</script>

<template>
  <DefaultLayout>
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto my-10 border">
      <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      <!-- Form Error Alert -->
      <div v-if="formError" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ formError }}
      </div>

      <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ meta }">
        <!-- First Name -->
        <div class="mb-4">
          <label for="first_name" class="block text-gray-700 font-bold mb-2">First Name</label>
          <Field
            name="first_name"
            type="text"
            id="first_name"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your first name"
          />
          <ErrorMessage name="first_name" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Last Name -->
        <div class="mb-4">
          <label for="last_name" class="block text-gray-700 font-bold mb-2">Last Name</label>
          <Field
            name="last_name"
            type="text"
            id="last_name"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your last name"
          />
          <ErrorMessage name="last_name" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
          <Field
            name="email"
            type="email"
            id="email"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
          <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Phone -->
        <div class="mb-4">
          <label for="phone" class="block text-gray-700 font-bold mb-2">Phone</label>
          <Field
            name="phone"
            type="tel"
            id="phone"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
          <ErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Address -->
        <div class="mb-4">
          <label for="address" class="block text-gray-700 font-bold mb-2">Address</label>
          <Field
            name="address"
            type="text"
            id="address"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your address"
          />
          <ErrorMessage name="address" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
          <div class="relative">
            <Field v-slot="{ field, meta }" name="password">
              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-bind="field"
                  class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a password"
                />
                <!-- Password Strength Indicators -->
                <div v-if="meta.touched && field.value" class="mt-2 space-y-1">
                  <div class="flex items-center gap-2">
                    <font-awesome-icon
                      :icon="['fas', getPasswordStrength(field.value).isLongEnough ? 'check' : 'times']"
                      class="w-4"
                      :class="getPasswordStrength(field.value).isLongEnough ? 'text-green-500' : 'text-gray-400'"
                    />
                    <span class="text-sm text-gray-600">At least 6 characters</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <font-awesome-icon
                      :icon="['fas', getPasswordStrength(field.value).hasUpperCase ? 'check' : 'times']"
                      class="w-4"
                      :class="getPasswordStrength(field.value).hasUpperCase ? 'text-green-500' : 'text-gray-400'"
                    />
                    <span class="text-sm text-gray-600">One uppercase letter</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <font-awesome-icon
                      :icon="['fas', getPasswordStrength(field.value).hasLowerCase ? 'check' : 'times']"
                      class="w-4"
                      :class="getPasswordStrength(field.value).hasLowerCase ? 'text-green-500' : 'text-gray-400'"
                    />
                    <span class="text-sm text-gray-600">One lowercase letter</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <font-awesome-icon
                      :icon="['fas', getPasswordStrength(field.value).hasNumber ? 'check' : 'times']"
                      class="w-4"
                      :class="getPasswordStrength(field.value).hasNumber ? 'text-green-500' : 'text-gray-400'"
                    />
                    <span class="text-sm text-gray-600">One number</span>
                  </div>
                </div>
              </div>
            </Field>
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-2 top-6 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <font-awesome-icon
                :icon="['far', showPassword ? 'eye-slash' : 'eye']"
                class="h-5 w-5"
              />
            </button>
          </div>
          <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Confirm Password -->
        <div class="mb-6">
          <label for="confirmPassword" class="block text-gray-700 font-bold mb-2">Confirm Password</label>
          <div class="relative">
            <Field
              name="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              id="confirmPassword"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <font-awesome-icon
                :icon="['far', showPassword ? 'eye-slash' : 'eye']"
                class="h-5 w-5"
              />
            </button>
          </div>
          <ErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Terms and Conditions -->
        <div class="mb-6">
          <label class="flex items-center">
            <Field
              name="acceptTerms"
              id="acceptTerms"
              type="checkbox"
              :value="true"
              :unchecked-value="false"
              class="rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-600">
              I agree to the
              <a href="/terms" class="text-blue-500 hover:underline">Terms and Conditions</a>
              and
              <a href="/privacy" class="text-blue-500 hover:underline">Privacy Policy</a>
            </span>
          </label>
          <ErrorMessage name="acceptTerms" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Signup Button -->
        <button
          type="submit"
          id="register_button"
          :disabled="!meta.valid"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-bold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign Up
        </button>
      </Form>
      <Toast />

      <!-- Login Link -->
      <p class="text-center text-gray-600 mt-4">
        Already have an account?
        <RouterLink to="/login" class="text-blue-500 font-bold hover:underline">
          Log in here
        </RouterLink>
      </p>
    </div>
  </DefaultLayout>
</template>