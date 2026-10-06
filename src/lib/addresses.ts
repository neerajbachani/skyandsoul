import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const addressSelect = {
  id: true,
  label: true,
  recipientName: true,
  phone: true,
  line1: true,
  city: true,
  state: true,
  pincode: true,
  isDefault: true,
} as const;

type AddressWrite = {
  label?: string | null;
  recipientName: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
};

export async function listAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    select: addressSelect,
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function createAddress(userId: string, input: AddressWrite) {
  return prisma.$transaction(async (tx) => {
    const makeDefault = input.isDefault ?? false;
    if (makeDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    const existing = await tx.address.count({ where: { userId } });
    return tx.address.create({
      data: {
        userId,
        label: input.label || null,
        recipientName: input.recipientName,
        phone: input.phone,
        line1: input.line1,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
        isDefault: makeDefault || existing === 0,
      },
      select: addressSelect,
    });
  });
}

export async function updateAddress(
  userId: string,
  addressId: string,
  input: Partial<AddressWrite>,
) {
  const current = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!current) return null;

  return prisma.$transaction(async (tx) => {
    if (input.isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const data: Prisma.AddressUpdateInput = {};
    if (input.label !== undefined) data.label = input.label || null;
    if (input.recipientName !== undefined) data.recipientName = input.recipientName;
    if (input.phone !== undefined) data.phone = input.phone;
    if (input.line1 !== undefined) data.line1 = input.line1;
    if (input.city !== undefined) data.city = input.city;
    if (input.state !== undefined) data.state = input.state;
    if (input.pincode !== undefined) data.pincode = input.pincode;
    if (input.isDefault !== undefined) data.isDefault = input.isDefault;

    return tx.address.update({
      where: { id: addressId },
      data,
      select: addressSelect,
    });
  });
}

export async function deleteAddress(userId: string, addressId: string) {
  const current = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!current) return false;

  await prisma.$transaction(async (tx) => {
    await tx.address.delete({ where: { id: addressId } });
    if (current.isDefault) {
      const next = await tx.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      if (next) {
        await tx.address.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }
  });

  return true;
}
