import { Listbox } from '@headlessui/react';
import ComboBoxArrow from '../assets/icons/ComboBoxArrow.svg';

type ComboBoxProps = {
  placeholder: string;
  name: string[];
  width?: number;
  value: string;
  onChange: (value: string) => void;
};

export default function PCComboBox({
  placeholder,
  name,
  value,
  onChange,
}: ComboBoxProps) {
  return (
    <div className="relative w-70 h-12">
      <Listbox value={value} onChange={onChange}>
        <Listbox.Button className="flex flex-row justify-between w-full py-2 px-5 border rounded bg-zinc-100 text-left text-2xl font-bold  ">
          {value || placeholder}
          <img src={ComboBoxArrow} alt="view more" />
        </Listbox.Button>
        <Listbox.Options className="absolute z-9999 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border">
          {name.map((person, idx) => (
            <Listbox.Option
              key={idx}
              value={person}
              className={({ active }) =>
                `cursor-pointer select-none py-2 px-3 ${
                  active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-900'
                }`
              }
            >
              {person}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
