import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, Database, Cookie, Users, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for MindReMinder - How we protect and handle your personal information.",
}

export default function PrivacyPage() {
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
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground mb-4">Last updated: January 1, 2025</p>
          <Badge variant="secondary">GDPR & CCPA Compliant</Badge>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Personal Information</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and email address (for account creation)</li>
                <li>Profile information you choose to provide</li>
                <li>Reminder content (text, images, locations)</li>
                <li>Usage data and preferences</li>
              </ul>

              <h4 className="font-semibold">Automatically Collected Information</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Device information and identifiers</li>
                <li>IP address and location data (when permitted)</li>
                <li>Usage analytics and performance data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain the MindReMinder service</li>
                <li>Send you reminders and notifications</li>
                <li>Generate AI-powered quotes based on your preferences</li>
                <li>Improve our service and develop new features</li>
                <li>Communicate with you about updates and support</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                3. Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We do not sell your personal information. We may share information in these limited circumstances:</p>

              <h4 className="font-semibold">With Your Consent</h4>
              <p>When you choose to share reminders or quotes with friends through the app.</p>

              <h4 className="font-semibold">Service Providers</h4>
              <p>With trusted third-party services that help us operate the app (hosting, analytics, AI services).</p>

              <h4 className="font-semibold">Legal Requirements</h4>
              <p>When required by law, court order, or to protect our rights and safety.</p>

              <h4 className="font-semibold">Business Transfers</h4>
              <p>In connection with a merger, acquisition, or sale of assets (with user notification).</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                4. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We implement appropriate security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                While we strive to protect your information, no method of transmission over the internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                5. Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use cookies and similar technologies for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Authentication and account management</li>
                <li>Remembering your preferences</li>
                <li>Analytics and performance monitoring</li>
                <li>Improving user experience</li>
              </ul>
              <p>You can control cookie preferences through your browser settings or our cookie consent banner.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Rectification:</strong> Correct inaccurate or incomplete data
                </li>
                <li>
                  <strong>Erasure:</strong> Request deletion of your data
                </li>
                <li>
                  <strong>Portability:</strong> Export your data in a readable format
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your data
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain types of processing
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Revoke consent for data processing
                </li>
              </ul>
              <p>To exercise these rights, contact us at privacy@mindreminder.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We retain your information for as long as necessary to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide the MindReMinder service</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
              </ul>
              <p>
                When you delete your account, we will delete your personal data within 30 days, except where retention
                is required by law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                8. International Data Transfers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure
                appropriate safeguards are in place for international transfers, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Standard contractual clauses</li>
                <li>Adequacy decisions by relevant authorities</li>
                <li>Certification schemes and codes of conduct</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                MindReMinder is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13.
              </p>
              <p>
                If you are a parent or guardian and believe your child has provided us with personal information, please
                contact us to have it removed.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting the new policy on this page</li>
                <li>Sending you an email notification</li>
                <li>Providing notice through the app</li>
              </ul>
              <p>Changes become effective when posted unless otherwise stated.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>If you have questions about this Privacy Policy or our data practices, contact us:</p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> privacy@mindreminder.com
                </p>
                <p>
                  <strong>Data Protection Officer:</strong> dpo@mindreminder.com
                </p>
                <p>
                  <strong>Address:</strong> MindReMinder Privacy Team
                </p>
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
