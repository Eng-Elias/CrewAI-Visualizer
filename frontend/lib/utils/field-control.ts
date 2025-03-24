import { EntityFieldControl } from '../types/field-control';

export function getFieldVisibility(
  fieldControl: EntityFieldControl | undefined,
  section: string,
  field: string
): 'show' | 'hide' | 'readonly' {
  if (!fieldControl) return 'show';
  
  const sectionControl = fieldControl[section as keyof typeof fieldControl];
  if (!sectionControl) return 'show';
  
  return (sectionControl as Record<string, 'show' | 'hide' | 'readonly'>)[field] || 'show';
}

export function shouldShowField(
  fieldControl: EntityFieldControl | undefined,
  section: string,
  field: string
): boolean {
  return getFieldVisibility(fieldControl, section, field) !== 'hide';
}

export function isFieldReadOnly(
  fieldControl: EntityFieldControl | undefined,
  section: string,
  field: string
): boolean {
  return getFieldVisibility(fieldControl, section, field) === 'readonly';
} 