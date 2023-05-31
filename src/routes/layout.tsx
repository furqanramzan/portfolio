import { Link, useLocation } from '@builder.io/qwik-city';
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
    {
      name: 'Projects',
      href: '/projects/',
    },
  ];
  const location = useLocation();
  const navbarHidden = useSignal(true);
  return (
    <>
      <nav class="left-0 top-0 z-20 w-full">
        <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <Link href="/" class="flex items-center text-6xl text-white">
            <TbBrandFoursquare />
          </Link>
          <div class="flex md:order-2">
            <div class="flex items-center text-white">
              <a
                class="mr-4 text-2xl text-white hover:text-blue-700"
                href="https://github.com/furqanramzan"
                target="_blank"
              >
                <BsGithub />
              </a>
              <a
                class="text-2xl text-white hover:text-blue-700"
                href="https://twitter.com/furqan271996"
                target="_blank"
              >
                <BsTwitter />
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
                  <Link
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
                  </Link>
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
