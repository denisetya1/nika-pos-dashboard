"use client";

import { Product } from "@prisma/client";
import React from "react";
import Barcode from "react-barcode";

type MyProps = {
  product: Product;
};

class BarcodePrintComponent extends React.Component<MyProps> {
  constructor(props: MyProps) {
    super(props);
  }

  render() {
    return (
      <div className="w-[150px] flex flex-col items-center justify-center text-center p-[4px]">
        <div className="w-full text-[9px] text-left z-10 capitalize px-[4px]">
          {this.props.product.name.substring(0, 30).toLowerCase()}
        </div>
        <div className="mt-[-10px]">
          {this.props.product.barcode !== null &&
            this.props.product.barcode !== "" && (
              <Barcode
                height={22}
                width={1}
                displayValue={false}
                value={this.props.product.barcode}
              />
            )}
        </div>
        <div className="text-[10px] mt-[-10px]">
          {this.props.product.barcode}
        </div>
      </div>
    );
  }
}

export default BarcodePrintComponent;
