<script lang="ts">
  interface Props {
    id: string
    content: string
    createdAt: string
    topics: string[]
  }

  let { id, content, createdAt, topics }: Props = $props()
</script>

<li class="bg-redis-white dark:bg-redis-black-90 border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg p-3">
  <h4 class="text-xs font-semibold uppercase mb-1 text-redis-sky-blue">
    {id}
  </h4>
  <p class="text-sm text-redis-black dark:text-redis-white leading-relaxed mb-1">
    {content}
  </p>
  {#if topics.length > 0}
    <div class="flex flex-wrap gap-1 mb-1">
      {#each topics as topic}
        <span class="text-xs px-2 py-0.5 rounded bg-redis-sky-blue/10 text-redis-sky-blue dark:bg-redis-sky-blue/20">
          {topic}
        </span>
      {/each}
    </div>
  {/if}
  <p class="text-xs text-redis-black-50 dark:text-redis-dusk-50">
    {createdAt}
  </p>
</li>
