import { component$, useSignal } from '@builder.io/qwik';

export default component$<{
  blurImage: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  classes?: string;
}>(({ blurImage, image, alt, width, height, classes = '' }) => {
  const imageLoaded = useSignal(false);

  return (
    <>
      <img
        class={[{ hidden: imageLoaded.value }, classes]}
        src={`data:image/png;base64, ${blurImage}`}
        width={width}
        height={height}
        alt={alt}
      />
      <img
        class={[{ hidden: !imageLoaded.value }, classes]}
        src={image}
        width={width}
        height={height}
        alt={alt}
        onLoad$={() => (imageLoaded.value = true)}
      />
    </>
  );
});
