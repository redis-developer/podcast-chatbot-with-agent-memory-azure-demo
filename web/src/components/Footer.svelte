<script lang="ts">
  import { version } from '@root/package.json'
</script>

<footer
  class="flex items-end justify-between px-5 py-4 shrink-0 bg-redis-white dark:bg-redis-black border-t border-redis-black-10 dark:border-redis-dusk-70"
>
  <span class="text-base text-redis-black dark:text-redis-white opacity-60 font-mono">podbot v{version}</span>
  <a href="https://redis.io" target="_blank" rel="noopener noreferrer">
    <img src="redis-logo-hyper.svg" alt="Redis" class="h-7" />
  </a>
</footer>
