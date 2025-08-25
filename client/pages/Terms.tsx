import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  FileText,
  Scale,
  Zap,
  Heart,
  Star,
  Gift,
  Sparkles,
} from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-pink-50 via-tea-green-50 to-tea-mint-50">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-tea-pink-300 opacity-40 animate-pulse">
          <Scale size={28} />
        </div>
        <div className="absolute top-40 right-20 text-tea-green-400 opacity-50 animate-bounce">
          <Shield size={24} className="animate-pulse delay-100" />
        </div>
        <div className="absolute bottom-32 left-16 text-tea-neutral-400 opacity-60">
          <Sparkles size={20} className="animate-pulse delay-200" />
        </div>
        <div className="absolute top-64 left-1/3 text-tea-pink-200 opacity-30">
          <Star size={16} className="animate-pulse delay-300" />
        </div>
        <div className="absolute bottom-20 right-32 text-tea-green-300 opacity-45">
          <Heart size={22} className="animate-pulse delay-75" />
        </div>
        <div className="absolute top-32 left-2/3 text-tea-neutral-300 opacity-35">
          <Gift size={18} className="animate-pulse delay-150" />
        </div>
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-tea-neutral-200 bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-tea-neutral-600 hover:text-tea-pink-600 transition-colors p-2 rounded-lg hover:bg-tea-pink-50"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tea-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-tea-neutral-800">
                  Tea Time
                </h1>
              </div>
              <Badge className="bg-tea-green-100 text-tea-green-700 border-tea-green-300 px-3 py-1">
                <FileText className="w-4 h-4 mr-1" />
                Terms & Conditions
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-tea-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Scale className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-tea-neutral-800 mb-6">
              Terms & Conditions
            </h2>
            <p className="text-xl text-tea-neutral-600 mb-6 max-w-2xl mx-auto">
              Please read these terms carefully before using Tea Time. By using
              our platform, you agree to these terms.
            </p>
            <div className="bg-tea-pink-50 border border-tea-pink-200 rounded-xl p-4 text-sm text-tea-pink-700">
              <AlertTriangle className="w-5 h-5 inline mr-2" />
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            {/* 1. Acceptance of Terms */}
            <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-tea-neutral-800 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-tea-pink-600" />
                  1. Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-tea max-w-none">
                <p className="text-tea-neutral-700 leading-relaxed mb-4">
                  By accessing and using Tea Time ("the Platform", "we", "us",
                  "our"), you acknowledge that you have read, understood, and
                  agree to be bound by these Terms and Conditions. If you do not
                  agree to these terms, you must not use this platform.
                </p>
                <p className="text-tea-neutral-700 leading-relaxed">
                  <strong className="text-tea-pink-600">
                    Your use of this platform constitutes your legal acceptance
                    of these terms.
                  </strong>
                </p>
              </CardContent>
            </Card>

            {/* 2. User Responsibility and Liability */}
            <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-tea-neutral-800 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-tea-pink-600" />
                  2. User Responsibility and Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-tea max-w-none">
                <div className="bg-tea-pink-50 border border-tea-pink-200 rounded-lg p-4 mb-4">
                  <p className="text-tea-pink-700 font-semibold mb-2">
                    ⚠️ IMPORTANT: YOU ARE SOLELY RESPONSIBLE FOR YOUR ACTIONS
                  </p>
                </div>
                <ul className="text-tea-neutral-700 leading-relaxed space-y-2">
                  <li>
                    <strong>Personal Responsibility:</strong> You are entirely
                    responsible for all content you post, share, or communicate
                    on this platform.
                  </li>
                  <li>
                    <strong>Content Ownership:</strong> You own and are
                    responsible for any stories, images, comments, or other
                    content you submit.
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> You must ensure all your
                    content complies with applicable laws and regulations.
                  </li>
                  <li>
                    <strong>Truthfulness:</strong> You are responsible for the
                    accuracy and truthfulness of your stories and content.
                  </li>
                  <li>
                    <strong>Privacy of Others:</strong> You must respect others'
                    privacy and not share identifying information without
                    consent.
                  </li>
                  <li>
                    <strong>Consequences:</strong> You accept full
                    responsibility for any consequences arising from your use of
                    this platform.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 3. Platform Disclaimer and Limitation of Liability */}
            <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-tea-neutral-800 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-tea-pink-600" />
                  3. Platform Disclaimer and Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-tea max-w-none">
                <div className="bg-tea-green-50 border border-tea-green-200 rounded-lg p-4 mb-4">
                  <p className="text-tea-green-700 font-semibold">
                    🛡️ PLATFORM PROTECTION CLAUSE
                  </p>
                </div>
                <div className="space-y-4 text-tea-neutral-700">
                  <p>
                    <strong>3.1 No Liability:</strong> The platform owners,
                    developers, administrators, and operators ("Platform Team")
                    are NOT LIABLE for any content posted by users or any
                    consequences arising from such content.
                  </p>

                  <p>
                    <strong>3.2 User-Generated Content:</strong> All stories,
                    comments, images, and other content are created by users. We
                    do not endorse, verify, or take responsibility for any
                    user-generated content.
                  </p>

                  <p>
                    <strong>3.3 Platform as a Service:</strong> We provide a
                    platform for users to share content. We are not responsible
                    for how users choose to use this platform or the content
                    they create.
                  </p>

                  <p>
                    <strong>3.4 No Legal Responsibility:</strong> Users cannot
                    hold the Platform Team legally responsible for:
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>• Content posted by other users</li>
                    <li>• Emotional distress caused by stories or comments</li>
                    <li>• Privacy violations by other users</li>
                    <li>• Defamatory or harmful content</li>
                    <li>
                      • Any real-world consequences of platform interactions
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 4. No Lawsuit Clause */}
            <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-tea-neutral-800 flex items-center gap-3">
                  <Scale className="w-6 h-6 text-tea-pink-600" />
                  4. No Lawsuit and Legal Action Waiver
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-tea max-w-none">
                <div className="bg-tea-pink-50 border border-tea-pink-200 rounded-lg p-4 mb-4">
                  <p className="text-tea-pink-700 font-semibold">
                    🚫 WAIVER OF RIGHT TO SUE
                  </p>
                </div>
                <div className="space-y-4 text-tea-neutral-700">
                  <p>
                    <strong>4.1 Legal Action Waiver:</strong> By using this
                    platform, you WAIVE your right to sue, take legal action
                    against, or seek damages from the Platform Team for any
                    reason related to your use of this platform.
                  </p>

                  <p>
                    <strong>4.2 No Claims:</strong> You agree that you will NOT:
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>• File lawsuits against the Platform Team</li>
                    <li>• Seek monetary damages from the Platform Team</li>
                    <li>
                      • Hold the Platform Team liable for any user content
                    </li>
                    <li>
                      • Pursue legal action for emotional distress, privacy
                      violations, or defamation caused by other users
                    </li>
                  </ul>

                  <p>
                    <strong>4.3 Dispute Resolution:</strong> Any disputes
                    between users are to be resolved between the users
                    themselves. The Platform Team is not a mediator or
                    arbitrator.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 5. Content and Conduct */}
            <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-tea-neutral-800 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-tea-pink-600" />
                  5. Content and Conduct Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-tea max-w-none">
                <div className="space-y-4 text-tea-neutral-700">
                  <p>
                    <strong>5.1 Community Platform:</strong> This is a
                    community-based storytelling platform. Users can share
                    relationship experiences in a supportive environment.
                  </p>

                  <p>
                    <strong>5.2 User Guidelines:</strong> While we encourage
                    free expression, users should:
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>
                      • Respect others' privacy (no real names, addresses, phone
                      numbers)
                    </li>
                    <li>• Avoid posting illegal content</li>
                    <li>
                      • Take responsibility for their stories and comments
                    </li>
                    <li>
                      • Understand that all content is public and permanent
                    </li>
                  </ul>

                  <p>
                    <strong>5.3 Content Ownership:</strong> You retain ownership
                    of your content but grant us the right to display it on the
                    platform.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 6. Platform Rights and Modifications */}
            <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-tea-neutral-800 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-tea-pink-600" />
                  6. Platform Rights and Modifications
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-tea max-w-none">
                <div className="space-y-4 text-tea-neutral-700">
                  <p>
                    <strong>6.1 Right to Modify:</strong> We reserve the right
                    to modify, suspend, or discontinue the platform at any time
                    without notice.
                  </p>

                  <p>
                    <strong>6.2 Content Moderation:</strong> We may (but are not
                    obligated to) remove content that violates these terms or
                    applicable laws.
                  </p>

                  <p>
                    <strong>6.3 Terms Updates:</strong> These terms may be
                    updated at any time. Continued use constitutes acceptance of
                    new terms.
                  </p>

                  <p>
                    <strong>6.4 No Guarantees:</strong> We provide the platform
                    "as is" with no guarantees of availability, functionality,
                    or data preservation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 7. Final Legal Provisions */}
            <Card className="bg-white/85 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-tea-neutral-800 flex items-center gap-3">
                  <Scale className="w-6 h-6 text-tea-pink-600" />
                  7. Final Legal Provisions
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-tea max-w-none">
                <div className="bg-tea-neutral-50 border border-tea-neutral-200 rounded-lg p-4 mb-4">
                  <p className="text-tea-neutral-700 font-semibold">
                    ⚖️ LEGAL PROTECTION SUMMARY
                  </p>
                </div>
                <div className="space-y-4 text-tea-neutral-700">
                  <p>
                    <strong>7.1 Severability:</strong> If any part of these
                    terms is found unenforceable, the rest remains in effect.
                  </p>

                  <p>
                    <strong>7.2 Entire Agreement:</strong> These terms
                    constitute the entire agreement between you and the Platform
                    Team.
                  </p>

                  <p>
                    <strong>7.3 Indemnification:</strong> You agree to indemnify
                    and hold harmless the Platform Team from any claims,
                    damages, or costs arising from your use of the platform.
                  </p>

                  <p>
                    <strong>7.4 Governing Law:</strong> These terms are governed
                    by applicable local laws where the platform is operated.
                  </p>

                  <div className="bg-tea-pink-50 border border-tea-pink-200 rounded-lg p-4 mt-4">
                    <p className="text-tea-pink-700 font-semibold text-center">
                      🔒 BY USING THIS PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE
                      READ, UNDERSTOOD, AND AGREE TO ALL TERMS AND CONDITIONS
                      ABOVE
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back to Login */}
          <div className="text-center mt-16">
            <Link to="/login">
              <Button className="bg-tea-pink-600 hover:bg-tea-pink-700 text-white rounded-2xl px-12 py-4 text-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                <ArrowLeft className="w-5 h-5 mr-3" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
