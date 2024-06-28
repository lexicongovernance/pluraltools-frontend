// src/components/multi-select.tsx

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon, XCircle, ChevronDown, XIcon, WandSparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Separator } from '@/_components/ui/separator';
import { Button } from '@/_components/ui/button';
import { Badge } from '@/_components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/_components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/_components/ui/command';

const multiSelectVariants = cva('m-1', {
  variants: {
    variant: {
      default:
        'bg-[var(--color-white)] border border-solid border-[var(--color-black)] py-1 px-3 text-sm',
      secondary:
        'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive:
        'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      inverted: 'inverted',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  asChild?: boolean;
  className?: string;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = 'Select options',
      animation = 0,
      maxCount = 3,
      className,
      ...props
    },
    ref,
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true);
      } else if (event.key === 'Backspace' && !event.currentTarget.value) {
        const newSelectedValues = [...defaultValue];
        newSelectedValues.pop();
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (value: string) => {
      const newSelectedValues = defaultValue.includes(value)
        ? defaultValue.filter((v) => v !== value)
        : [...defaultValue, value];
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = defaultValue.slice(0, maxCount);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (defaultValue.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        onValueChange(allValues);
      }
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              'flex h-auto min-h-[50px] w-full items-center justify-between rounded-sm border border-solid border-[var(--color-black)] bg-inherit p-1 hover:bg-inherit',
              className,
            )}
          >
            {defaultValue.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {defaultValue.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        className={cn(
                          isAnimating
                            ? 'animate-bounce font-normal text-[var(--color-black)]'
                            : 'font-normal text-[var(--color-black)]',
                          multiSelectVariants({ variant, className }),
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                        {option?.label}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          color="var(--color-black)"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {defaultValue.length > maxCount && (
                    <Badge
                      className={cn(
                        'border-foreground/1 font-normal text-[var(--color-black)] hover:bg-transparent',
                        isAnimating ? 'animate-bounce' : '',
                        multiSelectVariants({ variant, className }),
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {`+ ${defaultValue.length - maxCount} more`}
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        color="var(--color-black)"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearExtraOptions();
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="text-muted-foreground mx-2 h-4 cursor-pointer"
                    color="var(--color-black)"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator orientation="vertical" className="flex h-full min-h-6" />
                  <ChevronDown
                    className="text-muted-foreground mx-2 h-5 cursor-pointer"
                    color="var(--color-black)"
                  />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="text-muted-foreground mx-3 text-[16px] text-[var(--color-gray)]">
                  {placeholder}
                </span>
                <ChevronDown
                  className="text-muted-foreground mx-2 h-5 cursor-pointer"
                  color="var(--color-black)"
                />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] border border-solid border-[var(--color-black)] bg-[var(--color-white)] p-0 text-[var(--color-black)]"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command className="bg-inherit">
            <CommandInput
              placeholder="Search..."
              onKeyDown={handleInputKeyDown}
              className="text-[16px] text-[var(--color-black)] placeholder:text-[var(--color-gray)]"
            />
            <CommandList>
              <CommandEmpty className="p-4 text-center text-[16px] text-[var(--color-black)]">
                No results found.
              </CommandEmpty>
              <CommandGroup className="p-0">
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  style={{ pointerEvents: 'auto', opacity: 1 }}
                  className="cursor-pointer rounded-none p-3 text-[var(--color-black)] data-[selected=true]:bg-[var(--color-gray)] data-[selected=true]:text-[var(--color-black)]"
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-[var(--color-black)]',
                      defaultValue.length === options.length
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible',
                    )}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <span className="text-[16px]">(Select All)</span>
                </CommandItem>
                {options.map((option) => {
                  const isSelected = defaultValue.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      style={{ pointerEvents: 'auto', opacity: 1 }}
                      className="cursor-pointer rounded-none p-3 text-[var(--color-black)] data-[selected=true]:bg-[var(--color-gray)] data-[selected=true]:text-[var(--color-black)]"
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-[var(--color-black)]',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      {option.icon && (
                        <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                      )}
                      <span className="text-[16px]">{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
        {animation > 0 && defaultValue.length > 0 && (
          <WandSparkles
            className={cn(
              'text-foreground bg-background my-2 h-3 w-3 cursor-pointer',
              isAnimating ? '' : 'text-muted-foreground',
            )}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    );
  },
);

MultiSelect.displayName = 'MultiSelect';
