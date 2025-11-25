<script lang="ts">
  import LoginViewModel from './login-view-model.svelte'

  const viewModel = LoginViewModel.instance

  const statusIcon = $derived(viewModel.hasLoginError ? 'fa-solid fa-exclamation-triangle' : 'fa-solid fa-info-circle')
  const statusIconColor = $derived(viewModel.hasLoginError ? 'text-redis-deep-hyper' : 'text-redis-sky-blue')

  const statusMessage = $derived(
    viewModel.hasLoginError
      ? 'Invalid password. Use "password" to login.'
      : 'Enter any username. Password is required and must be "password".'
  )
</script>

<div
  class="flex items-center gap-3 p-6 mt-8 h-20 bg-redis-light-gray dark:bg-redis-black-90 border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg"
>
  <i class="{statusIcon} {statusIconColor} text-3xl shrink-0 mr-1"></i>
  <p class="text-sm text-redis-black dark:text-redis-white">{statusMessage}</p>
</div>
