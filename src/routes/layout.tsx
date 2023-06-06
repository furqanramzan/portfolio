import { useLocation } from '@builder.io/qwik-city';
import { component$, Slot, useSignal } from '@builder.io/qwik';

export default component$(() => {
  const locations = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Skills',
      href: '/skills/',
    },
    {
      name: 'Projects',
      href: '/projects/',
    },
    {
      name: 'About',
      href: '/about/',
    },
  ];
  const location = useLocation();
  const navbarHidden = useSignal(true);
  const hoverIcon = useSignal<
    'upwork' | 'github' | 'linkedin' | 'twitter' | 'devto' | undefined
  >();
  return (
    <>
      <nav class="left-0 top-0 z-20 w-full">
        <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <a href="/" class="flex items-center text-6xl text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 3h10c.644 0 1.11.696.978 1.33l-1.984 9.859a1.014 1.014 0 0 1-1 .811H12.74c-.308 0-.6.141-.793.382l-4.144 5.25c-.599.752-1.809.331-1.809-.632V4c0-.564.44-1 1-1zm5 6h5"
              />
            </svg>
          </a>
          <div class="flex md:order-2">
            <div class="flex items-center text-white">
              <a
                class="mr-4 cursor-pointer text-3xl text-white hover:text-blue-700"
                href="https://www.upwork.com/freelancers/~016621b11e28c78a5f"
                target="_blank"
                onMouseEnter$={() => (hoverIcon.value = 'upwork')}
                onMouseLeave$={() => (hoverIcon.value = undefined)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke={hoverIcon.value === 'upwork' ? 'blue' : '#fff'}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 7v5a3 3 0 0 0 6 0V7h1l4 6c.824 1.319 1.945 2 3.5 2a3.5 3.5 0 0 0 0-7c-2.027 0-3.137 1-3.5 3c-.242 1.33-.908 4-2 8"
                  />
                </svg>
              </a>
              <a
                class="mr-4 cursor-pointer text-2xl text-white hover:text-blue-700"
                href="https://github.com/furqanramzan"
                target="_blank"
                onMouseEnter$={() => (hoverIcon.value = 'github')}
                onMouseLeave$={() => (hoverIcon.value = undefined)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke={hoverIcon.value === 'github' ? 'blue' : '#fff'}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"
                  />
                </svg>
              </a>
              <a
                class="mr-4 cursor-pointer text-3xl text-white hover:text-blue-700"
                href="https://dev.to/furqanramzan"
                target="_blank"
                onMouseEnter$={() => (hoverIcon.value = 'devto')}
                onMouseLeave$={() => (hoverIcon.value = undefined)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill={hoverIcon.value === 'devto' ? 'blue' : '#fff'}
                    d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44l.04 2.45l.56-.02c.41 0 .63-.07.83-.26c.24-.24.26-.36.26-2.2c0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9c.27.43.29.6.32 2.57c.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04l-.75.03v1.77l1.22.03l1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48c.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79c-.18 0-.45-.15-.67-.39c-.32-.32-.45-.63-.82-2.08l-.9-3.39l-.45-1.67h.76c.4 0 .75.02.75.05c0 .06 1.16 4.54 1.26 4.83c.04.15.32-.7.73-2.3l.66-2.52l.74-.04c.4-.02.73 0 .73.04c0 .14-1.67 6.38-1.8 6.68z"
                  />
                </svg>
              </a>
              <a
                class="mr-4 cursor-pointer text-2xl text-white hover:text-blue-700"
                href="https://www.linkedin.com/in/furqan271996/"
                target="_blank"
                onMouseEnter$={() => (hoverIcon.value = 'linkedin')}
                onMouseLeave$={() => (hoverIcon.value = undefined)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke={hoverIcon.value === 'linkedin' ? 'blue' : '#fff'}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm4 5v5m0-8v.01M12 16v-5" />
                    <path d="M16 16v-3a2 2 0 0 0-4 0" />
                  </g>
                </svg>
              </a>
              <a
                class="cursor-pointer text-2xl text-white hover:text-blue-700"
                href="https://twitter.com/furqanramzan96"
                target="_blank"
                onMouseEnter$={() => (hoverIcon.value = 'twitter')}
                onMouseLeave$={() => (hoverIcon.value = undefined)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke={hoverIcon.value === 'twitter' ? 'blue' : '#fff'}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M22 4.01c-1 .49-1.98.689-3 .99c-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4c0 0-4.182 7.433 4 11c-1.872 1.247-3.739 2.088-6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753c0-.249 1.51-2.772 1.818-4.013z"
                  />
                </svg>
              </a>
            </div>
            <button
              type="button"
              class="ml-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
              aria-expanded={navbarHidden.value ? 'false' : 'true'}
              onClick$={() => (navbarHidden.value = !navbarHidden.value)}
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="h-6 w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            class={[
              'w-full items-center justify-between md:order-1 md:flex md:w-auto',
              { hidden: navbarHidden.value },
            ]}
          >
            <ul class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 text-center font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-transparent md:p-0">
              {locations.map(({ name, href }, index) => (
                <li key={index}>
                  <a
                    href={href}
                    class={[
                      'block rounded py-2 pl-3 pr-4 md:bg-transparent md:p-0',
                      {
                        'bg-blue-700 text-white md:bg-transparent md:text-blue-700':
                          location.url.pathname === href,
                        'text-gray-900 hover:bg-gray-100 md:text-white md:hover:bg-transparent md:hover:text-blue-700':
                          location.url.pathname !== href,
                      },
                    ]}
                    aria-current={
                      location.url.pathname === href ? 'page' : undefined
                    }
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <Slot />
    </>
  );
});
