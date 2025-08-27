// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth} from '@/lib/auth';

// 'use client';

// interface AdditionalInfoGuardProps {
//   children: React.ReactNode;
// }

// export default function AdditionalInfoGuard({ children }: AdditionalInfoGuardProps) {
//   const router = useRouter();
//   const { user, isLoading } = useAuth();

//   useEffect(() => {
//     if (isLoading) return;

//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     // 추가 정보가 필요한 경우 체크
//     const needsAdditionalInfo = !user.profile?.nickname || !user.profile?.birthDate;

//     if (needsAdditionalInfo) {
//       router.push('/onboarding/additional-info');
//       return;
//     }
//   }, [user, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//       </div>
//     );
//   }

//   if (!user || !user.profile?.nickname || !user.profile?.birthDate) {
//     return null;
//   }

//   return <>{children}</>;
// }
