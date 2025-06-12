"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const integrationsList = [
  {
    id: "google",
    name: "Google",
    description: "Connect your Google account for calendar and contacts integration",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
          <path
            fill="#4285F4"
            d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
          />
          <path
            fill="#34A853"
            d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
          />
          <path
            fill="#FBBC05"
            d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
          />
          <path
            fill="#EA4335"
            d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
          />
        </g>
      </svg>
    ),
    connected: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Connect your Slack workspace for notifications and updates",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#E01E5A"
          d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.687 8.834a2.528 2.528 0 0 1-2.521 2.521 2.527 2.527 0 0 1-2.521-2.521V2.522A2.527 2.527 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.166 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.166 24a2.527 2.527 0 0 1-2.521-2.522v-2.522h2.521zM15.166 17.687a2.527 2.527 0 0 1-2.521-2.521 2.526 2.526 0 0 1 2.521-2.521h6.312A2.527 2.527 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z"
        />
      </svg>
    ),
    connected: false,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Connect your GitHub account for project integration",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    connected: true,
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Connect your Dropbox account for file storage",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#0061FF" d="M6 2L0 6l6 4-6 4 6 4 6-4-6-4 6-4-6-4zm12 0l-6 4 6 4-6 4 6 4 6-4-6-4 6-4-6-4z" />
      </svg>
    ),
    connected: false,
  },
]

const Integrations = ({ user }) => {
  const [integrations, setIntegrations] = useState(integrationsList)

  const handleToggleIntegration = (id) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, connected: !integration.connected } : integration,
      ),
    )
  }

  const handleConnect = (id) => {
    toast.success("Integration initiated", {
      description: `Connecting to ${integrations.find((i) => i.id === id).name}...`,
    })

    // Simulate connection
    setTimeout(() => {
      handleToggleIntegration(id)
      toast.success("Integration successful", {
        description: `Connected to ${integrations.find((i) => i.id === id).name}`,
      })
    }, 1500)
  }

  const handleDisconnect = (id) => {
    toast.success("Disconnecting...", {
      description: `Disconnecting from ${integrations.find((i) => i.id === id).name}...`,
    })

    // Simulate disconnection
    setTimeout(() => {
      handleToggleIntegration(id)
      toast.success("Disconnected", {
        description: `Disconnected from ${integrations.find((i) => i.id === id).name}`,
      })
    }, 1500)
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-medium mb-6 text-gray-900">Integrations</h2>

      <div className="space-y-6">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-2 rounded-lg">{integration.icon}</div>
              <div>
                <h3 className="font-medium text-gray-900">{integration.name}</h3>
                <p className="text-sm text-gray-500">{integration.description}</p>
              </div>
            </div>

            <div>
              {integration.connected ? (
                <Button
                  variant="outline"
                  onClick={() => handleDisconnect(integration.id)}
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 bg-white"
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  onClick={() => handleConnect(integration.id)}
                  className="bg-blue-600 text-white hover:bg-blue-700 border-0"
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Integrations
