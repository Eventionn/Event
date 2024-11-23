-- CreateTable
CREATE TABLE "Events" (
    "eventID" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "description" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventstatus_id" UUID NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("eventID")
);

-- CreateTable
CREATE TABLE "EventStatus" (
    "eventStatusID" UUID NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "EventStatus_pkey" PRIMARY KEY ("eventStatusID")
);

-- CreateTable
CREATE TABLE "AddressEvents" (
    "addressEstablishmentID" UUID NOT NULL,
    "road" VARCHAR(20) NOT NULL,
    "roadNumber" INTEGER NOT NULL,
    "postCode" VARCHAR(20) NOT NULL,
    "localtown" UUID NOT NULL,
    "event_id" UUID NOT NULL,

    CONSTRAINT "AddressEvents_pkey" PRIMARY KEY ("addressEstablishmentID")
);

-- CreateTable
CREATE TABLE "RoutesEvents" (
    "routeID" UUID NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "order" INTEGER NOT NULL,
    "addressEvent_id" UUID NOT NULL,

    CONSTRAINT "RoutesEvents_pkey" PRIMARY KEY ("routeID")
);

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_eventstatus_id_fkey" FOREIGN KEY ("eventstatus_id") REFERENCES "EventStatus"("eventStatusID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressEvents" ADD CONSTRAINT "AddressEvents_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("eventID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutesEvents" ADD CONSTRAINT "RoutesEvents_addressEvent_id_fkey" FOREIGN KEY ("addressEvent_id") REFERENCES "AddressEvents"("addressEstablishmentID") ON DELETE RESTRICT ON UPDATE CASCADE;
