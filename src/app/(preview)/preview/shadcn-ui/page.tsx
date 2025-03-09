'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { UITheme } from '../../../../lib/theme-utils'
import './shadcn.css'
import { deserializeWithColor } from '../../../../lib/utils'
import { createShadcnCssVarsConfig } from '../../../../lib/theme-export'

export default function ShadcnUIPreview() {
  const [theme, setTheme] = useState<UITheme | null>(null)

  useEffect(() => {
    window.addEventListener('message', (event) => {
      console.log('event', event)
      if (event.data.type === 'SET_THEME') {
        const themeData = event.data.theme
        setTheme(deserializeWithColor(themeData) as UITheme)
      }
    })

    window.parent?.postMessage({ type: 'READY' }, '*')
  }, [])

  return (
    <div>
      {theme && (
        <style
          dangerouslySetInnerHTML={{
            __html:
              createShadcnCssVarsConfig(theme) +
              `:root { transition: font-size 0.3s ease-in-out; }`,
          }}
        />
      )}
      <div className="container mx-auto py-10 px-4 space-y-12">
        {/* Typography Section */}
        <section>
          <h1 className="text-4xl font-bold mb-4">Typography</h1>
          <Separator className="my-4" />

          <div className="space-y-6">
            <div>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Heading Level 1
              </h1>
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
                Heading Level 2
              </h2>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8">
                Heading Level 3
              </h3>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                Heading Level 4
              </h4>
            </div>

            <div className="space-y-4 mt-8">
              <p className="text-lg font-medium">
                Primary Text - The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-muted-foreground">
                Muted Text - The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-secondary-foreground">
                Secondary Text - The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-sm text-muted-foreground">
                Small muted text - The quick brown fox jumps over the lazy dog.
              </p>
              <p className="opacity-50">
                Disabled Text - The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </section>

        {/* Alerts Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Alerts</h2>
          <Separator className="my-4" />

          <div className="space-y-4">
            <Alert>
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is a standard alert with important information.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Something went wrong! Please check your submission.
              </AlertDescription>
            </Alert>

            <Alert className="bg-green-50 border-green-400 text-green-800">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your changes have been saved successfully.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Cards</h2>
          <Separator className="my-4" />

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>
                  Get a summary of your project status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Your project is currently 75% complete with 3 tasks remaining.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Balance</CardTitle>
                <CardDescription>Your current account status.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$1,234.56</div>
                <p className="text-muted-foreground mt-2">
                  Last updated 3 hours ago
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Buttons</h2>
          <Separator className="my-4" />

          <div className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <Button disabled>Disabled</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button variant="outline" size="icon">
              <span className="h-4 w-4">+</span>
            </Button>
          </div>
        </section>

        {/* Contact Form Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Contact Form</h2>
          <Separator className="my-4" />

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Get in touch</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
