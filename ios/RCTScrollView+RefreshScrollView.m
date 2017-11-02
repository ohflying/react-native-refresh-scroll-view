//
//  RCTScrollView+RefreshScrollView.m
//  RNRefreshScrollView
//
//  Created by admin on 2017/10/16.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTLog.h"
#import "RCTScrollView+RefreshScrollView.h"
#import <objc/runtime.h>

@interface RCTScrollView (RefreshScrollView)

- (void)animateScroll:(NSTimer *)timerParam;

@end

@implementation RCTScrollView (RefreshScrollView)


- (NSTimer *) flingScrollTimer
{
    NSTimer *_scrollTimer = objc_getAssociatedObject(self, @selector(flingScrollTimer));
    if (!_scrollTimer) {
        objc_setAssociatedObject(self, @selector(flingScrollTimer), _scrollTimer, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    
    return _scrollTimer;
}

- (void) setFlingScrollTimer:(NSTimer *)flingScrollTimer
{
    objc_setAssociatedObject(self, @selector(flingScrollTimer), flingScrollTimer, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (NSDate *) flingStartTime
{
    NSDate *_startTime = objc_getAssociatedObject(self, @selector(flingStartTime));
    if (!_startTime) {
        objc_setAssociatedObject(self, @selector(flingStartTime), _startTime, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    
    return _startTime;
}

- (void) setFlingStartTime:(NSDate *)flingStartTime
{
    objc_setAssociatedObject(self, @selector(flingStartTime), flingStartTime, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (CGFloat) flingLastValue
{
    NSNumber *_lastValue = objc_getAssociatedObject(self, @selector(flingLastValue));
    if (_lastValue) {
        return [_lastValue floatValue];
    }

    return 0;
}

- (void) setFlingLastValue:(CGFloat)flingLastValue
{
    NSNumber *_lastValue = [NSNumber numberWithFloat: flingLastValue];

    objc_setAssociatedObject(self, @selector(flingLastValue), _lastValue, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (CGPoint) flingLastOffset
{
    NSValue *_lastOffset = objc_getAssociatedObject(self, @selector(flingLastOffset));
    if (_lastOffset) {
        return [_lastOffset CGPointValue];
    }

    return CGPointZero;
}

- (void) setFlingLastOffset:(CGPoint)flingLastOffset
{
    NSValue *_lastOffset = [NSValue valueWithCGPoint:flingLastOffset];

    objc_setAssociatedObject(self, @selector(flingLastOffset), _lastOffset, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void) stopFling
{
    if (self.flingScrollTimer != nil) {
        [self.flingScrollTimer invalidate];
    }
}

- (void)fling:(CGFloat) velocity withDeceleration: (CGFloat)deceleration
{
    RCTLog(@"js fling fling %f", [[NSDate date] timeIntervalSince1970] * 1000);
    [self stopFling];

    [self setFlingStartTime: [NSDate date]];
    [self setFlingLastValue: 0];
    [self setFlingLastOffset: self.scrollView.contentOffset];
    
    NSDictionary *userInfo = @{@"velocity": [NSNumber numberWithFloat: velocity],
                           @"deceleration": [NSNumber numberWithFloat: deceleration]};

    [self setFlingScrollTimer: [NSTimer scheduledTimerWithTimeInterval:0.01
                                                                target:self
                                                              selector:@selector(animateScroll:)
                                                              userInfo:userInfo
                                                               repeats:YES
                                ]
     ];
}

- (void)animateScroll:(NSTimer *)timer
{
    NSDictionary *userInfo = timer.userInfo;
    const float velocity = [[userInfo objectForKey: @"velocity"] floatValue];
    const float deceleration = [[userInfo objectForKey: @"deceleration"]  floatValue];
    
    NSTimeInterval timeRunning = -[self.flingStartTime timeIntervalSinceNow] * 1000;
    
    float value = (velocity / (1 - deceleration)) * (1 - exp(-(1 - deceleration) * timeRunning));
    
    if (fabs(self.flingLastValue - value) < 0.1) {
        [timer invalidate];
        return;
    }

    CGFloat size = [self.scrollView contentSize].height - self.scrollView.frame.size.height;
    float offset = MAX(0, MIN(self.flingLastOffset.y + value, size));
    [self.scrollView setContentOffset: CGPointMake(self.flingLastOffset.x, offset) animated: false];
    [self setFlingLastValue: value];
    
    if (offset == size || offset == 0) {
        [timer invalidate];
    }
}

@end
