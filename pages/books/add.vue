<script setup>
import { reactive, ref, watch } from 'vue'
import UAlert from '~/components/UAlert.vue'
import { useRouter } from 'vue-router'

const form = reactive({
  title: '',
  author: '',
  errors: {}
})

const showAlert = ref(false)
const alertMessage = ref('Book added successfully!')
const alertType = ref('success') // 'error', 'info', etc.
const isLoading = ref(false)
const router = useRouter()

function validateForm(data) {
  form.errors = {}
  if (!data.title) {
    form.errors.title = 'Title is required'
  } else if (data.title.length < 3) {
    form.errors.title = 'Title must be at least 3 characters'
  }

  if (!data.author) {
    form.errors.author = 'Author is required'
  } else if (data.author.length < 2) {
    form.errors.author = 'Author name must be at least 2 characters'
  }

  return Object.keys(form.errors).length === 0
}

// Watchers to clear error messages immediately when input becomes valid
watch(() => form.title, (val) => {
  if (form.errors.title && val.length >= 3) {
    form.errors.title = ''
  }
})

watch(() => form.author, (val) => {
  if (form.errors.author && val.length >= 2) {
    form.errors.author = ''
  }
})

async function handleSubmit({ data }) {
  if (!validateForm(data)) {
  alertType.value = 'warning'
  alertMessage.value = Object.values(form.errors).join(' • ') || 'Please check your inputs',
  showAlert.value = true  
    return
  } 

  isLoading.value = true
 
  try {
  isLoading.value = true
  const bookData = {
    title: form.title,
    author: form.author
  };
  const { data: response, error } = await useFetch('/api/books/add', {
  method: 'POST',
  body: bookData, // Explicitly stringify the object
  headers: {
    'Content-Type': 'application/json' // Required header for JSON
  }
});

  if (error.value) {
  alertType.value = 'error'
  alertMessage.value = error.value.message || "Failed to save book"
  showAlert.value = true
    throw new Error(error.value.message || 'Failed to save book')
  }

  if (!response.value?.success) {
   alertType.value = 'error'
  alertMessage.value = response.value?.error || "Book submission failed"
  showAlert.value = true
    throw new Error(response.value?.error || 'Book submission failed')
  }else {
  alertType.value = 'success'
  alertMessage.value = 'Book saved successfully'
  showAlert.value = true
  // Reset form
  resetForm()
   router.push('/books')
  }
} catch (error) {
  // Error case
  alertType.value = 'error'
  alertMessage.value = error.message || 'Submission failed. Please try again.'
  showAlert.value = true
  
  console.error('Book submission error:', error)

} finally {
  isLoading.value = false
  
  // Hide alert after 3 seconds (more reasonable than 1s)
  setTimeout(() => {
    showAlert.value = false
  }, 3000)
}
}
function resetForm() {
  form.title = ''
  form.author = ''
  form.errors = {}
}
</script>


<template>
  <div class="max-w-lg mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl mt-12 border border-gray-200 dark:border-gray-700">
   
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-2">
      <UIcon name="i-heroicons-book-open" class="text-primary-500" />
      Add New Book
    </h2>
    
    <UAlert :type="alertType" :message="alertMessage" :show="showAlert" />
    <UForm 
      :state="form"
      @submit="handleSubmit"
      class="space-y-6"
    >
      <UFormField 
        label="Book Title" 
        name="title" 
        :error="form.errors.title"
      >
        <UInput 
          v-model="form.title" 
          placeholder="Enter book title"
          :disabled="isLoading"
          size="lg"
          class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800"
          autocomplete="off"
        />
        <p v-if="form.errors.title" class="text-red-600 mt-1">{{ form.errors.title }}</p>
      </UFormField>

      <UFormField 
        label="Author Name" 
        name="author" 
        :error="form.errors.author"
      >
        <UInput 
          v-model="form.author" 
          placeholder="Enter author name"
          :disabled="isLoading"
          size="lg"
          class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800"
          autocomplete="off"
        />
        <p v-if="form.errors.author" class="text-red-600 mt-1">{{ form.errors.author }}</p>
      </UFormField>

      <div class="flex justify-between items-center mt-6 space-x-4"> 
      <UButton 
          color="primary"
          variant="outline"
          icon="i-heroicons-arrow-left"
          class="py-2 px-4 font-medium text-lg"
            @click="$router.back()" 
        >
          Back
        </UButton>
        <UButton 
          type="submit" 
          color="primary"
          variant="solid"
          :loading="isLoading"
          :disabled="isLoading"
          class="py-2 px-6 font-medium text-lg"
          icon="i-heroicons-paper-airplane"
        >
          {{ isLoading ? 'Submitting...' : 'Submit Book' }}
        </UButton>  
      </div>
    </UForm>
  </div>
</template>

