import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { PaymentsService } from '../payments/payments.service';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';

describe('Security Hardening Tests', () => {
  let authService: AuthService;
  let paymentsService: PaymentsService;

  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockOrderRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockPaymentRepo = {
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_access_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        PaymentsService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepo,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  describe('AuthService - Privilege Escalation Prevention', () => {
    it('should NOT register a user as admin even if email contains the word "admin"', async () => {
      // Stub the user repository create & save to return the user entity with CUSTOMER role
      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRepo.create.mockImplementation((dto) => ({
        ...dto,
        id: 'user-uuid-123',
      }));
      mockUserRepo.save.mockImplementation((user) => Promise.resolve(user));

      const response = await authService.register({
        email: 'maliciousadmin@sweetslices.com',
        password: 'password123',
        name: 'Attacker Admin',
      });

      // Verify the returned user has 'customer' role, not 'admin'
      expect(response.user.role).toBe(UserRole.CUSTOMER);
    });
  });

  describe('PaymentsService - IDOR / BOLA Prevention', () => {
    it('should throw ForbiddenException if order does not belong to the requesting user and user is not admin', async () => {
      const requestingUser = { id: 'user-a-111', role: 'customer' };
      const orderOwner = { id: 'user-b-222', role: 'customer' };

      const mockOrder = {
        id: 'order-uuid-999',
        user: orderOwner,
        payment: { id: 'payment-uuid-111', status: PaymentStatus.PENDING },
      };

      mockOrderRepo.findOne.mockResolvedValue(mockOrder);

      await expect(
        paymentsService.processPayment(requestingUser, {
          orderId: 'order-uuid-999',
          paymentMethod: 'card',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should ALLOW payment if order belongs to the requesting user', async () => {
      const requestingUser = { id: 'user-a-111', role: 'customer' };

      const mockOrder = {
        id: 'order-uuid-999',
        user: requestingUser,
        payment: { id: 'payment-uuid-111', status: PaymentStatus.PENDING },
      };

      mockOrderRepo.findOne.mockResolvedValue(mockOrder);
      mockPaymentRepo.save.mockImplementation((p) => Promise.resolve(p));
      mockOrderRepo.save.mockImplementation((o) => Promise.resolve(o));

      const result = await paymentsService.processPayment(requestingUser, {
        orderId: 'order-uuid-999',
        paymentMethod: 'card',
      });

      expect(result.status).toBe(PaymentStatus.COMPLETED);
    });

    it('should ALLOW payment if order belongs to another user but requesting user is an admin', async () => {
      const requestingUser = { id: 'admin-user-000', role: 'admin' };
      const orderOwner = { id: 'user-b-222', role: 'customer' };

      const mockOrder = {
        id: 'order-uuid-999',
        user: orderOwner,
        payment: { id: 'payment-uuid-111', status: PaymentStatus.PENDING },
      };

      mockOrderRepo.findOne.mockResolvedValue(mockOrder);
      mockPaymentRepo.save.mockImplementation((p) => Promise.resolve(p));
      mockOrderRepo.save.mockImplementation((o) => Promise.resolve(o));

      const result = await paymentsService.processPayment(requestingUser, {
        orderId: 'order-uuid-999',
        paymentMethod: 'card',
      });

      expect(result.status).toBe(PaymentStatus.COMPLETED);
    });
  });
});
