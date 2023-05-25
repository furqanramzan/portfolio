import { useLocation } from '@builder.io/qwik-city';
import { component$, Slot, useSignal } from '@builder.io/qwik';
import { TbBrandFoursquare } from '@qwikest/icons/tablericons';
import { BsGithub, BsTwitter } from '@qwikest/icons/bootstrap';

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
  ];
  const location = useLocation();
  const navbarHidden = useSignal(true);
  return (
    <>
      <nav class="fixed w-full z-20 top-0 left-0">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" class="flex items-center text-white text-6xl">
            <TbBrandFoursquare />
          </a>
          <div class="flex md:order-2">
            <div class="text-white flex items-center">
              <a
                class="text-2xl mr-4"
                href="https://github.com/furqanramzan"
                target="_blank"
              >
                <BsGithub />
              </a>
              <a
                class="text-2xl"
                href="https://twitter.com/furqan271996"
                target="_blank"
              >
                <BsTwitter />
              </a>
            </div>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
              onClick$={() => (navbarHidden.value = !navbarHidden.value)}
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="w-6 h-6"
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
              'items-center justify-between w-full md:flex md:w-auto md:order-1',
              { hidden: navbarHidden.value },
            ]}
          >
            <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent text-center">
              {locations.map(({ name, href }, index) => (
                <li key={index}>
                  <a
                    href={href}
                    class={[
                      'block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0',
                      {
                        'text-white bg-blue-700 md:bg-transparent md:text-blue-700':
                          location.url.pathname === href,
                        'md:text-white text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700':
                          location.url.pathname !== href,
                      },
                    ]}
                    aria-current="page"
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
