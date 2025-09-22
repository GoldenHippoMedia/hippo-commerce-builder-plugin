import React, { useMemo } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineGlobeAlt,
  HiOutlineIdentification,
  HiOutlineShieldCheck,
  HiOutlineUser,
} from "react-icons/hi2";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { AppTabState } from "@application/AppCore";
import { useObserver } from "mobx-react";

interface UserSettingsPageProps {
  state: AppTabState;
}

const UserSettingsPage: React.FC<UserSettingsPageProps> = ({ state }) => {
  const userData = useMemo(() => {
    return state.context.user;
  }, [state.context.user]);
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return useObserver(() => (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <HiOutlineUser className="h-8 w-8" />
          User Settings
        </h1>
        <p className="text-base-content/70 mt-2">
          View your account information and current settings
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="card bg-base-200/50 shadow-sm">
          <div className="card-body">
            <h4 className="card-title text-lg flex items-center gap-2 mb-4">
              <HiOutlineIdentification className="h-5 w-5" />
              Profile Information
            </h4>

            <div className="flex flex-col md:flex-row gap-6">
              {userData.photoURL && (
                <div className="flex-shrink-0">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src={userData.photoURL} alt={userData.displayName} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-sm text-base-content/70">
                    Display Name
                  </span>
                  <p className="text-base font-medium">
                    {userData.displayName}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-sm text-base-content/70">
                    Email
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-base">{userData.email}</p>
                    {userData.emailVerified && (
                      <div className="badge badge-success badge-sm">
                        <HiOutlineShieldCheck className="h-3 w-3 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-sm text-base-content/70">
                    User ID
                  </span>
                  <p className="font-mono text-xs">{userData.uid}</p>
                </div>
                <div>
                  <span className="font-medium text-sm text-base-content/70">
                    Auth Provider
                  </span>
                  <p className="text-base capitalize">
                    {userData.settings.authProvider}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="card bg-base-200/50 shadow-sm">
          <div className="card-body">
            <h4 className="card-title text-lg flex items-center gap-2 mb-4">
              <HiOutlineCalendar className="h-5 w-5" />
              Account Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="font-medium text-sm text-base-content/70">
                  Member Since
                </span>
                <p className="text-base">
                  {formatDate(userData.settings.signupDate)}
                </p>
              </div>
              <div>
                <span className="font-medium text-sm text-base-content/70">
                  Last Active
                </span>
                <p className="text-base">
                  {formatDate(userData.settings.lastActiveTime)}
                </p>
              </div>
              <div>
                <span className="font-medium text-sm text-base-content/70">
                  Onboarding Status
                </span>
                <div
                  className={`badge ${userData.settings.hasCompletedOnboarding ? "badge-success" : "badge-warning"}`}
                >
                  {userData.settings.hasCompletedOnboarding
                    ? "Completed"
                    : "Pending"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="card bg-base-200/50 shadow-sm">
          <div className="card-body">
            <h4 className="card-title text-lg flex items-center gap-2 mb-4">
              <HiOutlineAcademicCap className="h-5 w-5" />
              Professional Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="font-medium text-sm text-base-content/70 mb-2 block">
                  Job Functions
                </span>
                <div className="flex flex-wrap gap-2">
                  {(userData.settings?.jobFunctions ?? []).map(
                    (func, index) => (
                      <div
                        key={index}
                        className="badge badge-primary badge-outline"
                      >
                        {func}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations */}
        <div className="card bg-base-200/50 shadow-sm">
          <div className="card-body">
            <h4 className="card-title text-lg flex items-center gap-2 mb-4">
              <HiOutlineOfficeBuilding className="h-5 w-5" />
              Organizations ({userData.organizations.length})
            </h4>

            <div className="space-y-4">
              {userData.organizations.map((org) => (
                <div
                  key={org.value.id}
                  className="flex items-start justify-between p-4 bg-base-100 rounded-lg"
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="font-semibold">{org.value.name}</h5>
                      <div className="badge badge-ghost badge-sm">
                        {org.value.type} • {org.value.kind}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-base-content/70">
                          Organization ID:
                        </span>
                        <p className="font-mono text-xs">{org.value.id}</p>
                      </div>
                      {org.value.siteUrl && (
                        <div>
                          <span className="font-medium text-base-content/70">
                            Site URL:
                          </span>
                          <a
                            href={org.value.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-primary text-sm flex items-center gap-1"
                          >
                            <HiOutlineGlobeAlt className="h-3 w-3" />
                            {org.value.siteUrl}
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-sm text-base-content/70">
                          Subscription:
                        </span>
                        <p className="font-mono text-xs">
                          {org.value.subscription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Note about read-only */}
        <div className="alert alert-info">
          <HiOutlineShieldCheck className="h-5 w-5" />
          <div>
            <h3 className="font-bold">Read-Only Settings</h3>
            <div className="text-xs">
              This page displays your current account information. Contact your
              administrator to modify settings.
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default UserSettingsPage;
