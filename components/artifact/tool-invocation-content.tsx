'use client'

import type { ToolPart } from '@/lib/types/ai'

import { SearchArtifactContent } from '@/components/artifact/search-artifact-content'
import { T } from '@/components/language-provider'

export function ToolInvocationContent({ part }: { part: ToolPart }) {
  switch (part.type) {
    case 'tool-search':
      return <SearchArtifactContent tool={part as ToolPart<'search'>} />
    default:
      return (
        <div className="p-4">
          <T text={'Details for this tool are not available'} />
        </div>
      )
  }
}
