import { component$, useSignal } from '@builder.io/qwik';

export default component$<{ blurImage: string; slug: string; name: string }>(
  ({ blurImage, slug, name }) => {
    const imageLoaded = useSignal(false);

    return (
      <>
        <img
          class={['w-full', { hidden: imageLoaded.value }]}
          src={blurImage}
          width={1120}
          height={555}
          alt={name}
        />
        <img
          class={['w-full', { hidden: !imageLoaded.value }]}
          src={`/assets/projects/${slug}.webp`}
          width={1120}
          height={550}
          alt={name}
          onLoad$={() => (imageLoaded.value = true)}
        />
      </>
    );
  },
);
