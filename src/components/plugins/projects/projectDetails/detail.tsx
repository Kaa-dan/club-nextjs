"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProjectApi } from "../projectApi";
import { useParams } from "next/navigation";
import React from "react";
import ContributionModal from "../contribution-modal";
import { ContributionApprovalModal } from "../contribution-details-modal";
export default function Details({
  project,
  forumId,
  forum,
}: {
  forumId: string;
  forum: TForum;
  project: TProjectData | undefined;
}) {
  const { postId } = useParams<{ postId: string }>();
  // function fetch(postId: string) {
  //   ProjectApi.singleView(postId).then((res) => {
  //     setProject(res);
  //   });
  // }
  // useEffect(() => {
  //   fetch(postId);
  // }, []);

  const [openApproval, setOpenApproval] = useState(false);
  const [selectedParam, setSelectedParam] = useState(null);
  const [open, setOPen] = useState<boolean>(false);
  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white shadow-sm">
      {/* Header Banner */}
      <div className="relative h-40 overflow-hidden rounded-t-lg bg-[#001529]">
        <Image
          src={project?.bannerImage.url as string}
          alt="Banner"
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight">
            {project?.title}
          </h2>
          <p className="leading-relaxed text-gray-600">
            {project?.significance}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {project?.parameters.map((param: any, index) => (
            <React.Fragment key={param._id}>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {param.title}
                      </p>
                      <p className="mt-1 text-2xl font-semibold">
                        {project?.contributions
                          .filter((item) => item.parameter === param._id)
                          .reduce(
                            (sum, contribution) => sum + contribution.value,
                            0
                          ) || 0}{" "}
                        / {param.value}
                      </p>
                    </div>
                    <span>
                      {Math.min(
                        ((project?.contributions
                          .filter((item) => item.parameter === param._id)
                          .reduce(
                            (sum, contribution) => sum + contribution.value,
                            0
                          ) || 0) /
                          (param.value || 0)) *
                          100,
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      ((
                        project?.contributions.find(
                          (item) => item.parameter === param._id
                        ) || 0
                      )?.value /
                        (param.value || 1)) *
                      100
                    }
                    className="mb-4 h-1.5"
                  />

                  <div className="flex justify-between gap-2">
                    <Button
                      onClick={() => {
                        setOPen(true);
                        setSelectedParam(param);
                      }}
                      variant="outline"
                      className="grow"
                    >
                      + Add Contribution
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedParam(param);
                        setOpenApproval(true);
                      }}
                      variant="outline"
                      size="icon"
                    >
                      <Eye className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </React.Fragment>
          ))}
          {selectedParam && open && (
            <ContributionModal
              param={selectedParam}
              forumId={forumId}
              open={open}
              projectId={postId}
              setOpen={setOPen}
              forum={forum}
              fetch={fetch}
            />
          )}

          {selectedParam && openApproval && (
            <ContributionApprovalModal
              // paramId={param._id}
              open={openApproval}
              setOpen={setOpenApproval}
              param={selectedParam}
              projectId={postId}
            />
          )}
        </div>
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-3 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-500">Region</div>
            <div className="text-sm font-medium">{project?.region}</div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-500">Budget</div>
            <div className="whitespace-nowrap text-sm font-medium">
              {project?.budget
                ? `${project.budget.currency || "$"} ${Number(project.budget.from).toLocaleString()} - ${Number(project.budget.to).toLocaleString()}`
                : "N/A"}
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-500">
              Deadlines
            </div>
            <div className="whitespace-nowrap text-sm font-medium">
              {(project?.deadline &&
                new Date(project?.deadline).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })) ||
                "NILL"}
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-500">
              Posted date
            </div>
            <div className="whitespace-nowrap text-sm font-medium">
              {new Date(project?.createdAt as Date).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-500">
              Participants
            </div>
            <div className="text-sm font-medium">23.56k</div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-500">
              Adopted
            </div>
            <div className="text-sm font-medium">236</div>
          </div>
        </div>

        {/* Contribution Section */}
        <div className="mb-8 border-b pb-8">
          <p className="mb-4 w-2/5 rounded-md bg-green-100 p-1 text-center text-xs font-medium text-emerald-500">
            239 Contribution from this forum
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-gray-200"></div>
              <div>
                <p className="font-medium">Leslie Alexander</p>
                <p className="mt-0.5 text-sm text-gray-500">14 min ago</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Eye className="size-4" />
                <span>12.5k Viewers</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <span>236 Adopted</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8 border-b pb-8">
          <h3 className="mb-3 text-lg font-semibold">Related event</h3>
          <p className="text-gray-600">
            The project aims to develop a comprehensive blood donation solution,
            including a mobile app and web platform. The app will enable users
            to locate nearby blood donation centers, schedule appointments, and
            receive reminders.
          </p>
        </div>
        <div className="mb-8 border-b pb-8">
          <h3 className="mb-3 text-lg font-semibold">Closing Remark</h3>
          <p className="text-gray-600">Until All passages are finished</p>
        </div>
        <div className="mb-8 border-b pb-8">
          <h3 className="mb-3 text-lg font-semibold">
            Project Solution In details
          </h3>
          <p className="mb-6 text-gray-600">
            The project aims to develop a comprehensive blood donation solution,
            including a mobile app and web platform. The app will enable users
            to locate nearby blood donation centers, schedule appointments, and
            receive reminders.
          </p>
        </div>
        <div className="mb-8 border-b pb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="mb-1 text-sm text-gray-500">Nursing Assistant</p>
              <p className="font-medium">Cameron Williamson</p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-sm text-gray-500">Nursing Assistant</p>
              <p className="font-medium">Albert Flores</p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-sm text-gray-500">Medical Assistant</p>
              <p className="font-medium">Devon Lane</p>
            </div>
          </div>
        </div>
        <div className="mb-8 border-b pb-8">
          <h3 className="mb-3 text-lg font-semibold">
            How to take part in this project
          </h3>
          <p className="text-gray-600">
            Locate a nearby blood donation center or blood drive event in your
            area. You can search online or contact local hospitals, clinics, or
            blood banks for information on where to donate.
          </p>
        </div>

        <div className="mb-8 border-b pb-8">
          <h3 className="mb-3 text-lg font-semibold">About the Promoters</h3>
          <p className="mb-4 text-gray-600">{project?.aboutPromoters}</p>
        </div>
        <div className="mb-8 border-b pb-8">
          <p className="mb-3 text-sm text-gray-500">Promoters</p>
          <div className="mb-2 flex gap-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-gray-200"></div>
              <span className="text-sm">Savannah Nguyen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-gray-200"></div>
              <span className="text-sm">Brooklyn Simmons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-gray-200"></div>
              <span className="text-sm">Jerome Bell</span>
            </div>
          </div>
        </div>

        <div className="mb-8 border-b pb-8">
          <h3 className="mb-3 text-lg font-semibold">
            Funding received details
          </h3>
          <p className="text-gray-600">
            Funding received for blood donation initiatives typically comes from
            various sources, including government grants, corporate
            sponsorships, fundraising events, and individual donations.
          </p>
        </div>
        <div className="mb-8 border-b pb-8">
          <h3 className="mb-3 text-lg font-semibold">Key Takeaway</h3>
          <p className="text-gray-600">{project?.keyTakeaways}</p>
        </div>

        <div className="mb-8 border-b pb-8">
          <h3 className="mb-3 text-lg font-semibold">Celebrity Champions</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-gray-200"></div>
              <span className="text-sm">Savannah Nguyen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-gray-200"></div>
              <span className="text-sm">Brooklyn Simmons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-gray-200"></div>
              <span className="text-sm">Jerome Bell</span>
            </div>
          </div>
        </div>
        <div className="mb-8 border-b pb-8">
          <h3 className="mb-3 text-lg font-semibold">Risks & Challenges</h3>
          <p className="text-gray-600">{project?.risksAndChallenges}</p>
        </div>
      </div>
    </div>
  );
}
