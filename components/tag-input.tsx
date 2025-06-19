"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Plus, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

interface TagCategory {
  category: string;
  tags?: string[];
  subcategories?: TagCategory[];
}

interface TagInputProps {
  predefinedTags: TagCategory[];
  initialSelectedTags?: string[]
  onChange?: (selectedTags: string[]) => void
}

const getAllFlattenedTags = (categories: TagCategory[]): string[] => {
  let flattenedTags: string[] = [];
  categories.forEach(cat => {
    if (cat.tags) {
      flattenedTags = flattenedTags.concat(cat.tags);
    }
    if (cat.subcategories) {
      flattenedTags = flattenedTags.concat(getAllFlattenedTags(cat.subcategories));
    }
  });
  return flattenedTags;
};

export function TagInput({ predefinedTags, initialSelectedTags = [], onChange }: TagInputProps) {
  const allTags = useMemo(() => {
    return getAllFlattenedTags(predefinedTags);
  }, [predefinedTags]);

  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags)
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    const initialAvailable = allTags.filter(tag => !initialSelectedTags.includes(tag))
    setAvailableTags(initialAvailable.sort())
    setSelectedTags(initialSelectedTags)
  }, [allTags, initialSelectedTags])

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      const updatedSelected = selectedTags.filter((t) => t !== tag)
      setSelectedTags(updatedSelected)
      setAvailableTags([...availableTags, tag].sort())
      onChange?.(updatedSelected)
    } else {
      const updatedSelected = [...selectedTags, tag]
      setSelectedTags(updatedSelected)
      setAvailableTags(availableTags.filter((t) => t !== tag).sort())
      onChange?.(updatedSelected)
    }
  }

  const renderTags = (tagsToRender: string[], isSelected: boolean) => (
    <div className="flex flex-wrap gap-2 py-2">
      {tagsToRender
        .filter(tag => isSelected ? selectedTags.includes(tag) : availableTags.includes(tag))
        .map((tag) => (
          <Badge
            key={tag}
            variant={isSelected ? "default" : "secondary"}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm cursor-pointer ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => handleTagClick(tag)}
          >
            {isSelected ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            {tag}
          </Badge>
        ))}
    </div>
  );

  const renderCategories = (categories: TagCategory[]) => (
    <Accordion type="multiple" className="w-full">
      {categories.map((categoryData) => (
        <AccordionItem key={categoryData.category} value={categoryData.category}>
          <AccordionTrigger className="text-md font-semibold text-gray-700 hover:no-underline py-2">{categoryData.category}</AccordionTrigger>
          <AccordionContent>
            {categoryData.tags && renderTags(categoryData.tags!, false)}
            {categoryData.subcategories && (
              <div className="space-y-4 pt-2">
                {categoryData.subcategories.map(subCategoryData => (
                  <div key={subCategoryData.category} className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-600">{subCategoryData.category}</h4>
                    {subCategoryData.tags && renderTags(subCategoryData.tags!, false)}
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <div className="space-y-4">
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {renderTags(selectedTags, true)}
        </div>
      )}

      {renderCategories(predefinedTags)}
    </div>
  )
} 