'use client';

import { use } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PackageReviewStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Mock data
  const reviewStatus = {
    status: 'pending_review',
    submittedAt: '2024-01-15',
    reviewedAt: null,
    comments: null,
  };

  const getStatusIcon = () => {
    switch (reviewStatus.status) {
      case 'approved':
        return <CheckCircle2 className="h-12 w-12 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return <Clock className="h-12 w-12 text-orange-500" />;
    }
  };

  const getStatusColor = () => {
    switch (reviewStatus.status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link href={`/developer/marketplace/${id}`}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Package
            </Button>
          </Link>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Review Status</h1>
            <Badge className={`text-lg px-4 py-2 ${getStatusColor()}`}>
              {reviewStatus.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <GlassCard className="bg-white border-gray-200 p-8 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Submitted</span>
                <span className="font-medium">{reviewStatus.submittedAt}</span>
              </div>
              {reviewStatus.reviewedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reviewed</span>
                  <span className="font-medium">{reviewStatus.reviewedAt}</span>
                </div>
              )}
            </div>
          </GlassCard>

          {reviewStatus.comments && (
            <GlassCard className="bg-white border-gray-200 p-8 mb-6">
              <h2 className="text-xl font-semibold mb-4">Review Comments</h2>
              <p className="text-gray-600">{reviewStatus.comments}</p>
            </GlassCard>
          )}

          {reviewStatus.status === 'pending_review' && (
            <GlassCard className="bg-white border-gray-200 p-8">
              <p className="text-gray-600 text-center mb-4">
                Your package is currently under review. We'll notify you once the review is complete.
              </p>
              <Button variant="outline" className="w-full">
                Edit Package
              </Button>
            </GlassCard>
          )}

          {reviewStatus.status === 'rejected' && (
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                Edit & Resubmit
              </Button>
              <Button variant="outline" className="flex-1">
                View Details
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

