"use client";

import { type CityDto } from "@rent-to-craft/dtos";
import AsyncSelect from "react-select/async";

import CityService from "@/app/services/city.service";

type Option = { value: number; label: string; data: CityDto };

type Props = {
  readonly onChange?: (city: CityDto | null) => void;
  readonly placeholder?: string;
  readonly defaultValue?: CityDto | null;
};

const CityAutocomplete = ({ onChange, placeholder, defaultValue }: Props) => {
  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    if (!inputValue || inputValue.trim().length < 2) return [];
    const results = await CityService.search(inputValue);
    return results.map((c) => ({
      value: c.id!,
      label: `${c.name}`,
      data: c,
    }));
  };

  const defaultOption = defaultValue?.id
    ? { value: defaultValue.id, label: defaultValue.name, data: defaultValue }
    : null;

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={false}
      loadOptions={loadOptions}
      onChange={(opt) => onChange?.(opt ? (opt as Option).data : null)}
      placeholder={placeholder ?? "Rechercher une ville..."}
      defaultValue={defaultOption}
      isClearable
      styles={{
        container: (base) => ({ ...base, minWidth: 260 }),
      }}
    />
  );
};

export default CityAutocomplete;
