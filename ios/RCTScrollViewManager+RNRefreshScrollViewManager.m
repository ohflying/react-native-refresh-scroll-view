//
//  RCTScrollViewManager+RNRefreshScrollViewManager.m
//  RNRefreshScrollView
//
//  Created by admin on 2017/10/16.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTScrollViewManager+RNRefreshScrollViewManager.h"

#import "RCTScrollView+RefreshScrollView.h"
#import "RCTShadowView.h"
#import "RCTUIManager.h"

@implementation RCTScrollViewManager (RNRefreshScrollViewManager)

RCT_EXPORT_METHOD(stopFling: (nonnull NSNumber *)reactTag)
{
    RCTLog(@"js fling stopFling %f", [[NSDate date] timeIntervalSince1970] * 1000);
    
    [self.bridge.uiManager addUIBlock:
     ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RCTScrollView *> *viewRegistry) {
         
         RCTScrollView *view = viewRegistry[reactTag];
         if (!view || ![view isKindOfClass:[RCTScrollView class]]) {
             RCTLogError(@"Cannot find RCTScrollView with tag #%@", reactTag);
             return;
         }
         
         [view stopFling];
     }];
    
    bool OnOff = self.bridge.uiManager.unsafeFlushUIChangesBeforeBatchEnds;
    self.bridge.uiManager.unsafeFlushUIChangesBeforeBatchEnds = true;
    [self.bridge.uiManager partialBatchDidFlush];
    self.bridge.uiManager.unsafeFlushUIChangesBeforeBatchEnds = OnOff;
}

RCT_EXPORT_METHOD(fling: (nonnull NSNumber *)reactTag
                  velocity:(CGFloat)velocity
                  deceleration:(CGFloat)deceleration)
{
    RCTLog(@"fling1 %f velocity=%f", [[NSDate date] timeIntervalSince1970] * 1000, velocity);
    [self.bridge.uiManager addUIBlock:
     ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RCTScrollView *> *viewRegistry) {
         
         RCTScrollView *view = viewRegistry[reactTag];
         if (!view || ![view isKindOfClass:[RCTScrollView class]]) {
             RCTLogError(@"Cannot find RCTScrollView with tag #%@", reactTag);
             return;
         }

         [view fling:velocity withDeceleration:deceleration];
     }];
    
    bool OnOff = self.bridge.uiManager.unsafeFlushUIChangesBeforeBatchEnds;
    self.bridge.uiManager.unsafeFlushUIChangesBeforeBatchEnds = true;
    [self.bridge.uiManager partialBatchDidFlush];
    self.bridge.uiManager.unsafeFlushUIChangesBeforeBatchEnds = OnOff;
}
@end
