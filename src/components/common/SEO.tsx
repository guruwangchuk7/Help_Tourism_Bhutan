import { useEffect } from "react"

interface SEOProps {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogType?: string
  ogImage?: string
  schema?: Record<string, any> | Record<string, any>[]
}

export const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage = "https://www.helptourbhutan.com/paro-taksang.jpg",
  schema
}: SEOProps) => {
  useEffect(() => {
    // 1. Title
    document.title = title

    // 2. Meta Description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement("meta")
      metaDescription.setAttribute("name", "description")
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute("content", description)

    // 3. Meta Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta")
        metaKeywords.setAttribute("name", "keywords")
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute("content", keywords)
    }

    // 4. Open Graph Tags
    const updateOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`)
      if (!tag) {
        tag = document.createElement("meta")
        tag.setAttribute("property", property)
        document.head.appendChild(tag)
      }
      tag.setAttribute("content", content)
    }

    updateOgTag("og:title", title)
    updateOgTag("og:description", description)
    updateOgTag("og:type", ogType)
    updateOgTag("og:image", ogImage)
    updateOgTag("og:url", window.location.href)

    // 5. Twitter Card Tags
    const updateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`)
      if (!tag) {
        tag = document.createElement("meta")
        tag.setAttribute("name", name)
        document.head.appendChild(tag)
      }
      tag.setAttribute("content", content)
    }

    updateTwitterTag("twitter:title", title)
    updateTwitterTag("twitter:description", description)
    updateTwitterTag("twitter:image", ogImage)
    updateTwitterTag("twitter:url", window.location.href)

    // 6. Canonical Link
    const canonicalUrl = canonical || window.location.href.split("?")[0]
    let linkCanonical = document.querySelector('link[rel="canonical"]')
    if (!linkCanonical) {
      linkCanonical = document.createElement("link")
      linkCanonical.setAttribute("rel", "canonical")
      document.head.appendChild(linkCanonical)
    }
    linkCanonical.setAttribute("href", canonicalUrl)

    // 7. Schema Markup (JSON-LD)
    const existingSchemaScript = document.getElementById("jsonld-seo-schema")
    if (existingSchemaScript) {
      existingSchemaScript.remove()
    }

    if (schema) {
      const script = document.createElement("script")
      script.id = "jsonld-seo-schema"
      script.type = "application/ld+json"
      script.text = JSON.stringify(schema)
      document.head.appendChild(script)
    }

    return () => {
      // Clean up dynamic schemas on unmount
      const script = document.getElementById("jsonld-seo-schema")
      if (script) {
        script.remove()
      }
    }
  }, [title, description, keywords, canonical, ogType, ogImage, schema])

  return null
}

export default SEO
