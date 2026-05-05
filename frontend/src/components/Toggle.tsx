import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useStateApi } from '../hooks/useStateApi';

export default function Toggle({ state }: { state: string }) {
  const [enabled, setEnabled] = useState(state === 'PROGRESS');

  useEffect(() => {
    setEnabled(state === 'PROGRESS');
  }, [state]);

  useEffect(() => {
    const fetchData = async () => {
      await useStateApi.change({
        currentState: enabled ? 'PROGRESS' : 'STOP',
        currentAgendaId: null,
      });
    };
    fetchData();
  }, [enabled]);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-gray-200 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-[#86A6FF] data-focus:outline data-focus:outline-white"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-[white] shadow-2xl ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
      />
    </Switch>
  );
}
