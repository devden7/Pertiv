'use client';

import DataNotFound from '@/components/shared/DataNotFound';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/actions/supabase';
import { subscribeMembership } from '@/lib/actions/user.action';
import { IMembershipType } from '@/model/staff.model';
import { formatDateTime } from '@/utils/formatDateTime';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import { addDays, formatISO } from 'date-fns';
import React, { useEffect, useState } from 'react';

interface Props {
  data: IMembershipType[];
  token?: string;
}
const Pricing = ({ data, token }: Props) => {
  const [pricingData, setPricingData] = useState(data);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('Pricing Membership')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Membership',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            return setPricingData([
              ...pricingData,
              payload.new as IMembershipType,
            ]);
          } else if (payload.eventType === 'DELETE') {
            return setPricingData([]);
          } else {
            const oldBookId = payload.old.id;
            return setPricingData((prev) => {
              const takeData = [...prev];
              const index = takeData.findIndex((item) => item.id === oldBookId);
              if (index !== -1) {
                takeData[index] = { ...(payload.new as IMembershipType) };
              }
              return takeData;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pricingData, setPricingData]);

  const getStartedHandler = async () => {
    if (!token) {
      return;
    }

    const response = await subscribeMembership(data[0].id, token);

    if (!response) {
      toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
        duration: 2000,
      });

      return;
    }

    if (!response.success && response.statusCode !== 201) {
      return toast({
        variant: 'destructive',
        title: response.message,
        duration: 2000,
      });
    }

    toast({
      description: response.message,
      duration: 2000,
    });
    setIsOpen(false);
  };
  return (
    <section className="bg-white my-3">
      <div className="container">
        <h2 className="font-semibold mb-5 text-xl ">Join membership</h2>

        <div className="space-y-8 flex flex-wrap max-sm:gap-3 justify-center items-center lg:space-y-0">
          <DataNotFound data={pricingData} />
          {/* Pricing Card  */}
          {pricingData.length > 0 && (
            <div className="flex flex-col p-6 w-1/4 max-lg:w-1/2 max-md:w-full text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow">
              <h3 className="mb-4 text-2xl font-semibold">Basic</h3>
              <p className="font-light text-gray-500 sm:text-lg">
                Ordinary user package.
              </p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">RP 0</span>
              </div>
              {/* List */}
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  {/* icon */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>
                    Duration: <span className="font-semibold">lifetime</span>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* icon */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>
                    Max borrowed: <span className="font-semibold">2 books</span>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* icon */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>
                    Max returned: <span className="font-semibold">14 days</span>
                  </span>
                </li>
              </ul>
            </div>
          )}
          {/* pricing card  */}
          {pricingData.length > 0 && (
            <div className="flex flex-col p-6 w-1/4 max-lg:w-1/2 max-md:w-full text-center text-gray-900 bg-white rounded-lg border-2 border-primary-500 shadow xl:p-8">
              <h3 className="mb-4 text-2xl font-semibold capitalize">
                {pricingData[0].name}
              </h3>
              <p className="font-light text-gray-500 sm:text-lg">
                {pricingData[0].description}
              </p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">
                  Rp {formatNumberToRupiah(pricingData[0].price)}
                </span>
              </div>
              {/* list  */}
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  {/* icon */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>
                    Duration:{' '}
                    <span className="font-semibold">
                      {pricingData[0].durationDays} days
                    </span>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* icon */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>
                    Max borrowed:{' '}
                    <span className="font-semibold">
                      {pricingData[0].maxBorrow} books
                    </span>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* icon */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>
                    Max returned:{' '}
                    <span className="font-semibold">
                      {pricingData[0].maxReturn} days
                    </span>
                  </span>
                </li>
              </ul>
              <Dialog open={token ? isOpen : false} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="btn_primary"
                    onClick={() => {
                      if (!token) {
                        setIsOpen(false);
                        return toast({
                          description:
                            'Please login Before subscribing to membership',
                          duration: 2000,
                        });
                      }
                    }}
                  >
                    Get started
                  </Button>
                </DialogTrigger>
                <DialogContent className="overflow-auto max-h-[500px]">
                  <DialogHeader>
                    <div className="flex justify-between">
                      <div>
                        <DialogTitle>Confirm Subscription</DialogTitle>
                        <DialogDescription>
                          Upgrade your account to next level
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  <p className="text-center text-red-500 text-lg font-semibold">
                    Your account wil become {pricingData[0].name} until{' '}
                    {formatDateTime(
                      formatISO(
                        addDays(new Date(), pricingData[0].durationDays)
                      )
                    )}
                  </p>
                  <Button className="btn_primary" onClick={getStartedHandler}>
                    Subscribe
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
