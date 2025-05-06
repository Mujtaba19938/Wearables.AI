"use client"

import { Loader2 } from "lucide-react"

type SocialProvider = "google" | "facebook" | "twitter" | "apple"

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: SocialProvider) => void
  isLoading: boolean
  type: "login" | "signup"
}

export function SocialLoginButtons({ onSocialLogin, isLoading, type }: SocialLoginButtonsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <button
        type="button"
        className="flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 py-2 px-3 rounded-lg border border-border transition-colors"
        onClick={() => onSocialLogin("google")}
        disabled={isLoading}
        aria-label="Continue with Google"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span className="sr-only sm:not-sr-only sm:text-sm">Google</span>
      </button>

      <button
        type="button"
        className="flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 py-2 px-3 rounded-lg border border-border transition-colors"
        onClick={() => onSocialLogin("facebook")}
        disabled={isLoading}
        aria-label="Continue with Facebook"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="12" fill="#1877F2" />
          <path
            d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.8008 14.3391 7.875 15.8297 7.875H17.3438V4.92188C17.3438 4.92188 15.9703 4.6875 14.6578 4.6875C11.9156 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8547C10.7367 23.9508 11.3625 24 12 24C12.6375 24 13.2633 23.9508 13.875 23.8547V15.4688H16.6711Z"
            fill="white"
          />
        </svg>
        <span className="sr-only sm:not-sr-only sm:text-sm">Facebook</span>
      </button>

      <button
        type="button"
        className="flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 py-2 px-3 rounded-lg border border-border transition-colors"
        onClick={() => onSocialLogin("twitter")}
        disabled={isLoading}
        aria-label="Continue with Twitter"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.1623 5.65593C21.3989 5.99362 20.5893 6.2154 19.7603 6.31393C20.634 5.79136 21.288 4.96894 21.6003 3.99993C20.7803 4.48793 19.8813 4.82993 18.9443 5.01493C18.3149 4.34151 17.4807 3.89489 16.5713 3.74451C15.6618 3.59413 14.7282 3.74842 13.9156 4.18338C13.1029 4.61834 12.4567 5.30961 12.0774 6.14972C11.6981 6.98983 11.607 7.93171 11.8183 8.82893C10.1554 8.74558 8.52863 8.31345 7.04358 7.56059C5.55854 6.80773 4.24842 5.75097 3.1983 4.45893C2.82659 5.09738 2.63125 5.82315 2.6323 6.56193C2.6323 8.01193 3.3703 9.29293 4.4923 10.0429C3.82831 10.022 3.17893 9.84271 2.5983 9.51993V9.57193C2.5985 10.5376 2.93267 11.4735 3.54414 12.221C4.15562 12.9684 5.00678 13.4814 5.9533 13.6729C5.33691 13.84 4.6906 13.8646 4.0633 13.7449C4.33016 14.5762 4.8503 15.3031 5.55089 15.824C6.25147 16.3449 7.09742 16.6337 7.9703 16.6499C7.10278 17.3313 6.10947 17.8349 5.04718 18.1321C3.98488 18.4293 2.87442 18.5142 1.7793 18.3819C3.69099 19.6114 5.91639 20.264 8.1893 20.2619C15.8823 20.2619 20.0893 13.8889 20.0893 8.36193C20.0893 8.18193 20.0843 7.99993 20.0763 7.82193C20.8952 7.23009 21.6019 6.49695 22.1633 5.65693L22.1623 5.65593Z"
            fill="#1DA1F2"
          />
        </svg>
        <span className="sr-only sm:not-sr-only sm:text-sm">Twitter</span>
      </button>

      <button
        type="button"
        className="flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 py-2 px-3 rounded-lg border border-border transition-colors"
        onClick={() => onSocialLogin("apple")}
        disabled={isLoading}
        aria-label="Continue with Apple"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.5645 12.3242C17.5547 10.5761 18.4375 9.30469 20.2227 8.44922C19.2773 7.10156 17.8828 6.38672 16.0781 6.30078C14.3672 6.21875 12.5352 7.34375 11.8945 7.34375C11.2148 7.34375 9.60156 6.34766 8.29688 6.34766C5.82031 6.38672 3.17188 8.33594 3.17188 12.3047C3.17188 13.4219 3.36719 14.5781 3.75781 15.7734C4.28906 17.3438 6.19531 21.0469 8.19141 20.9844C9.25781 20.9609 9.99609 20.2266 11.4062 20.2266C12.7734 20.2266 13.457 20.9844 14.6484 20.9844C16.6641 20.9531 18.3711 17.6016 18.8789 16.0273C16.0039 14.7383 15.5645 12.4219 15.5645 12.3242H17.5645ZM14.6484 4.78125C16.1016 3.08594 15.9453 1.54688 15.9062 1C14.6172 1.07812 13.1484 1.89453 12.3633 2.89062C11.5039 3.94922 10.9961 5.19922 11.0938 6.28125C12.4609 6.39453 13.6328 5.91406 14.6484 4.78125Z"
            fill="black"
          />
        </svg>
        <span className="sr-only sm:not-sr-only sm:text-sm">Apple</span>
      </button>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}
