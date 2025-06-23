import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Scale, Users, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for MindReMinder - Your intelligent companion for meaningful reminders.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <Scale className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">Last updated: January 1, 2025</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing and using MindReMinder ("the Service"), you accept and agree to be bound by the terms and
                provision of this agreement.
              </p>
              <p>If you do not agree to abide by the above, please do not use this service.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                MindReMinder is an intelligent reminder application that helps users remember important moments, receive
                AI-generated inspirational quotes, and share meaningful reminders with friends.
              </p>
              <p>The Service includes both web and mobile applications, with features such as:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Smart reminders with text, images, and scheduling</li>
                <li>Location-based notifications</li>
                <li>AI-powered quote generation</li>
                <li>Social sharing capabilities</li>
                <li>Cross-platform synchronization</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts and Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>To access certain features of the Service, you must register for an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Acceptable Use Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Upload, post, or transmit any harmful, threatening, or illegal content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use the Service for commercial purposes without permission</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                information when you use the Service.
              </p>
              <p>
                By using the Service, you consent to the collection and use of your information as described in our
                Privacy Policy.
              </p>
              <Link href="/privacy">
                <Button variant="outline" size="sm">
                  Read Privacy Policy
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Service and its original content, features, and functionality are owned by MindReMinder and are
                protected by international copyright, trademark, patent, trade secret, and other intellectual property
                laws.
              </p>
              <p>
                You retain ownership of content you create and upload to the Service, but grant us a license to use,
                display, and distribute such content as necessary to provide the Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                7. Disclaimers and Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service
                will be uninterrupted, secure, or error-free.
              </p>
              <p>
                To the maximum extent permitted by law, MindReMinder shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may terminate or suspend your account and access to the Service immediately, without prior notice,
                for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
              <p>
                You may terminate your account at any time by contacting us or using the account deletion feature in the
                application.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes via
                email or through the Service.
              </p>
              <p>Your continued use of the Service after changes constitutes acceptance of the new Terms.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <div className="space-y-2">
                <p>Email: legal@mindreminder.com</p>
                <p>Address: MindReMinder Legal Department</p>
              </div>
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Contact Us
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
