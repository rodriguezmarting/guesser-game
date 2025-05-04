import * as React from "react";
import { Check } from "lucide-react";
import { getCharacters, type Character } from "~/api/characters";
import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export function CharacterSelector({
  selectedCharacter,
  setSelectedCharacter,
  disabled,
}: {
  selectedCharacter?: Character;
  setSelectedCharacter: (value: Character) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getCharacters();
      setCharacters(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={disabled}
        >
          {selectedCharacter ? selectedCharacter.label : "Select character..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 font-herculanum">
        <Command>
          <CommandInput placeholder="Search character..." className="h-9" />
          <CommandList>
            <CommandEmpty>No character found.</CommandEmpty>
            <CommandGroup>
              {loading ? (
                <div>Loading...</div>
              ) : (
                characters.map((character) => (
                  <CommandItem
                    key={character.value}
                    value={character.value}
                    onSelect={(currentValue) => {
                      const character = characters.find(
                        (character) => character.value === currentValue
                      );

                      if (character) {
                        setSelectedCharacter(character);
                        setOpen(false);
                      }
                    }}
                  >
                    <img
                      src={character.imageUrl}
                      alt={character.label}
                      className="shadow-md w-11 h-11 border-[1px] border-content rounded-sm"
                    />
                    {character.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedCharacter?.value === character.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
