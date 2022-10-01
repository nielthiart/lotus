import React, { FC, Fragment, useEffect, useState } from "react";
import { PlanType } from "../../types/plan-type";
import { Card, List, Form, Select, Button, Dropdown, Menu } from "antd";
import { CustomerDetailSubscription } from "../../types/customer-type";

interface Props {
  subscriptions: CustomerDetailSubscription[];
  plans: PlanType[] | undefined;
  onChange: (subscription: any) => void;
  onCancel: (subscription: cancelSubscriptionType) => void;
}
interface SubscriptionType {
  billing_plan_name: string;
  subscription_uid: string;
  auto_renew: boolean;
}
export interface cancelSubscriptionType {
  subscription_uid: string;
  bill_now: boolean;
  revoke_access: boolean;
}

const SubscriptionView: FC<Props> = ({
  subscriptions,
  plans,
  onChange,
  onCancel,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>();
  const [form] = Form.useForm();

  const [idtoPlan, setIDtoPlan] = useState<{ [key: string]: PlanType }>({});
  const [planList, setPlanList] =
    useState<{ label: string; value: string }[]>();

  const selectPlan = (plan_id: string) => {
    setSelectedPlan(plan_id);
  };

  const cancelSubscription = (props: cancelSubscriptionType) => {
    onCancel(props);
  };

  const cancelAcessBillNowSubscription = () => {
    cancelSubscription({
      subscription_uid: subscriptions[0].subscription_uid,
      bill_now: true,
      revoke_access: true,
    });
  };

  const cancelDontBillSubscription = () => {
    cancelSubscription({
      subscription_uid: subscriptions[0].subscription_uid,
      bill_now: false,
      revoke_access: true,
    });
  };
  const cancelDontRenewSubscriptions = () => {
    cancelSubscription({
      subscription_uid: subscriptions[0].subscription_uid,
      bill_now: false,
      revoke_access: false,
    });
  };

  useEffect(() => {
    if (plans !== undefined) {
      const planMap = plans.reduce((acc, plan) => {
        acc[plan.billing_plan_id] = plan;
        return acc;
      }, {} as { [key: number]: PlanType });
      setIDtoPlan(planMap);
      const newplanList: { label: string; value: string }[] = plans.map(
        (plan) => {
          return { label: plan.name, value: plan.billing_plan_id };
        }
      );
      setPlanList(newplanList);
    }
  }, [plans]);

  const cancelMenu = (
    <Menu
      items={[
        {
          label: (
            <Button onClick={() => cancelAcessBillNowSubscription()}>
              {" "}
              Cancel and Bill Now
            </Button>
          ),
          key: "0",
        },
        {
          label: (
            <Button onClick={() => cancelDontBillSubscription()}>
              {" "}
              Cancel Without Billing
            </Button>
          ),
          key: "1",
        },
        {
          label: (
            <Button onClick={() => cancelDontRenewSubscriptions()}>
              {" "}
              Cancel Renewal
            </Button>
          ),
          key: "1",
        },
      ]}
    />
  );

  const handleSubmit = () => {
    if (selectedPlan) {
      onChange(idtoPlan[selectedPlan]);
    }
    form.resetFields();
  };

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-xl font-main m-3">No Subscription</h3>
        <p className="font-bold">Please attach a Plan</p>
        <div className=" h-3/6">
          <Form onFinish={handleSubmit} form={form} name="create_subscription">
            <Form.Item name="plan">
              <Select
                showSearch
                placeholder="Select a plan"
                onChange={selectPlan}
                options={planList}
                optionLabelProp="label"
              >
                {" "}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit"> Attatch Plan</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-auto">
      <h2 className="text-left">Active Plan</h2>
      <div className="flex flex-col justify-center">
        <List>
          {subscriptions.map((subscription) => (
            <List.Item>
              <Card className=" bg-grey3 w-7/12">
                <div className="grid grid-cols-3 items-stretch">
                  <h2 className="font-main font-bold">
                    {subscription.billing_plan_name}
                  </h2>
                  <div className="flex flex-col justify-center space-y-3">
                    <p>Subscriptions ID: {subscription.subscription_uid}</p>
                    <p>Start Date: {subscription.start_date}</p>
                    <p>End Date: {subscription.end_date}</p>
                    <p>Renews: {subscription.auto_renew ? "yes" : "no"}</p>
                  </div>
                </div>
              </Card>
            </List.Item>
          ))}
        </List>
        <div className="grid grid-cols-2">
          <Dropdown overlay={cancelMenu} trigger={["click"]}>
            <Button>Switch Plan</Button>
          </Dropdown>
          <Dropdown overlay={cancelMenu} trigger={["click"]}>
            <Button>Cancel Subscription</Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionView;
