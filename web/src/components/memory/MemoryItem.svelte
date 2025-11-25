<script lang="ts">
  interface Props {
    content: string
    created: string
  }

  let { content, created }: Props = $props()
</script>

<li class="bg-redis-white dark:bg-redis-black-90 border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg p-3">
  <h4 class="text-xs font-semibold uppercase mb-1 text-redis-sky-blue">
    {created}
  </h4>
  <p class="text-sm text-redis-black dark:text-redis-white font-mono leading-relaxed">
    {content}
  </p>
</li>
