<template>
  <div>
    <div id="jumbotron" class="h-[36rem] flex flex-row justify-center items-center">
      <h1 class="text-3xl text-amber-600 font-bold">One platform to rule them all.</h1>
    </div>

    <div class="mb-32 text-white">
      <h2 class="text-3xl font-bold text-center mb-12">Features</h2>

      <div class="grid lg:grid-cols-2 gap-6 lg:gap-x-12">
        <div class="mb-6 lg:mb-0">
          <div class="block rounded-lg shadow-lg bg-white h-full">
            <div class="p-6 border-b border-gray-300 text-center">
              <p class="uppercase mb-4 text-sm">
                <strong>Basic</strong>
              </p>
              <h3 class="text-2xl mb-6">
                <strong>$ 129</strong>
                <small class="text-gray-500 text-sm">/year</small>
              </h3>

              <button type="button"
                      class="inline-block px-6 py-2.5 bg-transparent text-blue-600 font-medium text-xs leading-tight uppercase rounded hover:text-blue-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-0 active:bg-gray-200 transition duration-150 ease-in-out w-full"
                      style="background-color: hsl(0, 0%, 95%)"
              >
                Buy
              </button>
            </div>
            <div class="p-6">
              <ol class="list-inside">
                <li class="mb-4 flex items-center">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                       class="text-green-600 w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512">
                    <path fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>Unlimited updates
                </li>
                <li class="mb-4 flex items-center">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                       class="text-green-600 w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512">
                    <path fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>Git repository
                </li>
                <li class="mb-4 flex items-center">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                       class="text-green-600 w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512">
                    <path fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>npm installation
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div class="mb-6 lg:mb-0">
          <div class="block rounded-lg shadow-lg bg-white h-full">
            <div class="p-6 border-b border-gray-300 text-center">
              <p class="uppercase mb-4 text-sm">
                <strong>Advanced</strong>
              </p>
              <h3 class="text-2xl mb-6">
                <strong>$ 299</strong>
                <small class="text-gray-500 text-sm">/year</small>
              </h3>
              <button type="button"
                      class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                      data-mdb-ripple="true" data-ripple-color="light">
                Buy
              </button>
            </div>
            <div class="p-6">
              <ol class="list-inside">
                <li class="mb-4 flex items-center">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                       class="text-green-600 w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512">
                    <path fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>Unlimited updates
                </li>
                <li class="mb-4 flex items-center">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                       class="text-green-600 w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512">
                    <path fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>Git repository
                </li>
                <li class="mb-4 flex items-center">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                       class="text-green-600 w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512">
                    <path fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>npm installation
                </li>
                <li class="mb-4 flex items-center">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                       class="text-green-600 w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512">
                    <path fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>Code examples
                </li>
                <li class="mb-4 flex items-center">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                       class="text-green-600 w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512">
                    <path fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>Premium snippets
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
