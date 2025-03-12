
# Crypto Order Book

A real-time cryptocurrency order book dashboard built with React, TypeScript, and Tailwind CSS. Displays bids and asks for a selected trading pair, fetched via WebSocket, with visual indicators like volume bars and idle state detection.

## Features

-   **Real-Time Updates**: Subscribes to WebSocket streams for live order book data.
-   **Bids and Asks**: Displays buy (bids) and sell (asks) orders with prices and quantities.
-   **Volume Visualization**: Background progress bars indicate relative volume (green for bids, red for asks).
-   **Idle Detection**: Grays out the list if no updates occur within 3 seconds.
-   **Responsive Design**: Adapts to mobile and desktop layouts using Tailwind CSS.
-   **Formatted Numbers**: Custom helpers for price, quantity, and volume formatting.
-   **Virtualized Symbol List**: To ensure smooth scrolling and improved performance, the symbol list is virtualized. This allows for efficient rendering of large datasets by only rendering items that are currently visible on the screen.

## Tech Stack

-   **React**: Frontend library for building UI components.
-   **TypeScript**: Static typing for better code reliability.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **WebSocket**: Real-time data streaming via a custom context.
-   **Vite**: Fast build tool and development server.

## Prerequisites

-   **Node.js**: Version 18.x or higher.
-   **npm**: Version 9.x or higher (or use yarn/pnpm if preferred).

## Installation

1.  **Clone the Repository**:

```
    git clone https://github.com/LeMark0/order-book-client.git
    cd order-book-client
    yarn
```

## Run the Development Server

    yarn start

## Usage

-   **Select a Symbol**: Pass a trading pair (e.g., "BTCUSDT") to the OrderBook component.
-   **View Order Book**: See bids (green) and asks (red) with real-time updates.
-   **Idle State**: If no updates occur for 3 seconds, the list grays out.

## Future Improvements

As an MVP, this project can be enhanced in several ways:

-   **Test Coverage**: Expand unit and integration tests for components and hooks.
-   **Accessibility (a11y)**: Add ARIA labels, keyboard navigation, and screen reader support.
-   **Better Empty States**: Improve UX for no-data scenarios with informative messages or placeholders.
-   **Error Handling**: Implement robust error boundaries and WebSocket reconnection logic.
