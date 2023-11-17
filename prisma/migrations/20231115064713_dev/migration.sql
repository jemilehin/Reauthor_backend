-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "landed_property" BOOLEAN NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_type" TEXT NOT NULL,
    "price" BIGINT,
    "price_per_annum" BIGINT,
    "price_per_month" BIGINT,
    "images" BYTEA,
    "display_img" BYTEA,
    "auction" BOOLEAN,
    "auctioned_id" INTEGER,
    "auction_date" TIMESTAMP(3),
    "auction_start_time" TIMESTAMP(3),
    "auction_end_time" TIMESTAMP(3),
    "starting_price" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auctioned_Property" (
    "id" SERIAL NOT NULL,
    "auction_date" TIMESTAMP(3) NOT NULL,
    "auction_start_time" TIMESTAMP(3) NOT NULL,
    "auction_end_time" TIMESTAMP(3) NOT NULL,
    "auctioneer_user_id" INTEGER NOT NULL,
    "property_auctioned_id" INTEGER NOT NULL,
    "bid_change" BIGINT NOT NULL,
    "current_bid" BIGINT,
    "starting_price" BIGINT,
    "auction_winner_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auctioned_Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction_Participants" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "auction_property_id" INTEGER NOT NULL,
    "bid_price" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auction_Participants_pkey" PRIMARY KEY ("id")
);
