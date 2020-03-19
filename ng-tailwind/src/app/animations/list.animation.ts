import {
    animate, keyframes, query, stagger, style, transition, trigger
} from '@angular/animations';

export const listAnimation = trigger('listAnimation', [
    transition('* <=> *', [
      query(
        ':enter',
        [
          stagger(
            '80ms',
            animate(
              '300ms ease-in-out',
              keyframes([
                style({ opacity: 0, height: 0, offset: 0 }),
                style({ opacity: 0.6, height: 'auto', offset: 0.8 }),
                style({ opacity: 1, height: 'auto', offset: 1 }),
              ]),
            ),
          ),
        ],
        { optional: true },
      ),
      query(':leave', animate('200ms', style({ opacity: 0, height: 0 })), {
        optional: true,
      }),
    ]),
  ]);
