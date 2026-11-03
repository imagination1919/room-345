"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import { PendingWishlistItem } from "@modules/account/components/login-redirect-fields"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = ({
  redirectTo,
  wishlistItem,
}: {
  redirectTo?: string
  wishlistItem?: PendingWishlistItem
}) => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === "sign-in" ? (
        <Login
          setCurrentView={setCurrentView}
          redirectTo={redirectTo}
          wishlistItem={wishlistItem}
        />
      ) : (
        <Register
          setCurrentView={setCurrentView}
          redirectTo={redirectTo}
          wishlistItem={wishlistItem}
        />
      )}
    </div>
  )
}

export default LoginTemplate
