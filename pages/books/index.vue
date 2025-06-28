<template>
  <div class="book-listing mt-10">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Book Management</h1>
      <UButton icon="i-heroicons-plus" label="Add Book" to="/books/add" color="primary" />
    </div>
    <UAlert :type="alertType" :message="alertMessage" :show="showAlert" class="mb-2"/>
    <UCard>
      <UTable :rows="books" :columns="columns" :loading="loading">
      <!-- Custom cell for is_read status -->
    <template #is_read-data="{ row }">
      <UToggle
        :model-value="row.is_read"
        @update:model-value="(newValue) => updateReadStatus(row, newValue)"
        :loading="row.updating"
      />
      <span class="ml-2 text-sm">
        {{ row.is_read ? 'Read' : 'Unread' }}
      </span>
    </template>
        <template #actions-data="{ row }">
          <UDropdown :items="menuItems(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical" />
          </UDropdown>
        </template>
      </UTable>

      <div class="flex justify-between items-center px-3 py-3.5 border-t border-gray-200">
  <!-- Pagination Nav: centered horizontally -->
  <nav class="flex items-center space-x-2" aria-label="Pagination">
    <!-- Prev Button -->
    <button
      @click="prevPage"
      :disabled="page === 1"
      class="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Prev
    </button>

    <!-- Page Numbers -->
    <button
      v-for="p in totalPages"
      :key="p"
      @click="goToPage(p)"
      :class="[
        'px-3 py-1 rounded-md',
        p === page ? 'bg-orange-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
      ]"
      aria-current="page"
    >
      {{ p }}
    </button>

    <!-- Next Button -->
    <button
      @click="nextPage"
      :disabled="page === totalPages"
      class="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </nav>

  <!-- Page Info: aligned right -->
  <p class="text-gray-600 text-sm">
    Page {{ page }} of {{ totalPages }} — Total items: {{ total }}
  </p>
</div>

    </UCard>
  </div>
  
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

import { ref, onMounted, watch   } from 'vue';
import UAlert from '~/components/UAlert.vue';

const showAlert = ref(false)
const alertMessage = ref('Book added successfully!')
const alertType = ref('success')

const loading = ref(false)

// Reactive variables
const page = ref(1); // Current page (matches API response)
const limit = ref(10); // Items per page (matches API limit)
const total = ref(0); // Total items
const books = ref([]); // Book data

const totalPages = computed(() => Math.ceil(total.value / limit.value))

function goToPage(p) {
  if (p >= 1 && p <= totalPages.value) {
    page.value = p
  }
}

function prevPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

async function loadBooks() {
  try {
    loading.value = true

    const { data, error } = await useFetch('/api/books', {
      method: 'GET',
      query: {
        page: page.value,
        limit: limit.value
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (error.value) {
      throw new Error(error.value.message || 'Failed to fetch books')
    }

    const bookResponse = data.value

    if (!bookResponse || !bookResponse.data) {
      throw new Error('Invalid or empty response from server')
    }

   
    books.value = bookResponse.data
    total.value = bookResponse.total || 0
    totalPages.value = bookResponse.totalPages || 1
    // (Optional) sync current page
    page.value = bookResponse.page || page.value

    
    alertType.value = 'success'
    alertMessage.value = 'Books fetched successfully'
    showAlert.value = true

  } catch (err) {
    console.error('Error loading books:', err)

    alertType.value = 'error'
    alertMessage.value = err.message || 'Failed to load books. Please try again.'
    showAlert.value = true

  } finally {
    loading.value = false
    setTimeout(() => (showAlert.value = false), 3000)
  }
}

async function updateReadStatus(book,newValue) {
const rawObject = JSON.parse(JSON.stringify(book));
 try {
    loading.value = true;

    const { data: response, error } = await useFetch(`/api/books/status/${rawObject.id}`, {
      method: 'PATCH',
      body:{isRead:newValue},
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const bookResponse=JSON.parse(JSON.stringify(response.value));

    if (error.value) {
      throw new Error(error.value.message || "Failed to update book status");
    }

    if (!response.value) {
      throw new Error("Empty response from server");
    }
    alertType.value = 'success';
    alertMessage.value = 'Books status updated successfully';
    showAlert.value = true;
    loadBooks();

  } catch (error) {
    // Error case
    alertType.value = 'error';
    alertMessage.value = error.message || 'Failed to update book status. Please try again.';
    showAlert.value = true;
    console.error('Error updating book status:', error);
    
  } finally {
    loading.value = false;
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  }
}

async function deleteBook(bookId) {
 try {
    loading.value = true;

    const { data: response, error } = await useFetch(`/api/books/delete/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const bookResponse=JSON.parse(JSON.stringify(response.value));

    if (error.value) {
      throw new Error(error.value.message || "Failed to delete book");
    }

    if (!response.value) {
      throw new Error("Empty response from server");
    }
    alertType.value = 'success';
    alertMessage.value = 'Book deleted successfully';
    showAlert.value = true;
    loadBooks();

  } catch (error) {
    // Error case
    alertType.value = 'error';
    alertMessage.value = error.message || 'Operation Failed. Please try again.';
    showAlert.value = true;
    console.error('Error deleting book:', error);
    
  } finally {
    loading.value = false;
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  }
}

onMounted(() => {
  loadBooks()
})

watch(page, () => {
  loadBooks()
})

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'author', label: 'Author', sortable: true },
  { key: 'is_read', label: 'Is Read', sortable: true },
  { key: 'actions', label: 'Actions' }
]

const menuItems = (row) => [
  [{ label: 'Edit', icon: 'i-heroicons-pencil-square', click: () => navigateTo(`/books/edit/${row.id}`) }],
  [{ label: 'Delete', icon: 'i-heroicons-trash', click: () => deleteBook(row.id) }]
]
</script>