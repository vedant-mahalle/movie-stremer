import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TVShowFilters } from "@/components/tv-show-filters"
import { TVShowGrid } from "@/components/tv-show-grid"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function TVShowsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>TV Shows</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <TVShowFilters />
            </aside>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">TV Shows</h1>
                <p className="text-muted-foreground">1,523 shows found</p>
              </div>
              <TVShowGrid />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
